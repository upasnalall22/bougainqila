import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const NOTIFY_EMAIL = "studio@bougainqila.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-internal-secret",
};

// Allow-list of origins permitted to call the public "query" path.
// The "order" path additionally requires an internal shared secret.
const ALLOWED_ORIGINS = [
  "https://bougainqila.com",
  "https://www.bougainqila.com",
  "https://bougainqila.lovable.app",
  "https://id-preview--bff7b52e-cfe1-4a42-a7eb-3e3c0d7fc884.lovable.app",
];

function escapeHtml(value: unknown): string {
  const s = value == null ? "" : String(value);
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clip(value: unknown, max: number): string {
  const s = value == null ? "" : String(value);
  return s.slice(0, max);
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
}

function buildOrderEmailHtml(data: any): string {
  const items = Array.isArray(data.items) ? data.items.slice(0, 100) : [];
  const itemsHtml = items
    .map((i: any) => {
      const name = escapeHtml(clip(i?.name, 200));
      const qty = Number.isFinite(+i?.quantity) ? Math.max(0, Math.floor(+i.quantity)) : 0;
      const price = Number.isFinite(+i?.price) ? +i.price : 0;
      return `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee">${name}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center">${qty}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">₹${price.toLocaleString("en-IN")}</td></tr>`;
    })
    .join("");

  const subtotal = Number.isFinite(+data.subtotal) ? +data.subtotal : 0;
  const shipping = Number.isFinite(+data.shipping) ? +data.shipping : 0;
  const total = Number.isFinite(+data.total) ? +data.total : 0;

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
      <h2 style="color:#333;border-bottom:2px solid #c17f59;padding-bottom:8px">🛒 New Order Received</h2>
      <p><strong>Order:</strong> ${escapeHtml(clip(data.order_number, 64))}</p>
      <p><strong>Customer:</strong> ${escapeHtml(clip(data.customer_name, 200))}</p>
      <p><strong>Email:</strong> ${escapeHtml(clip(data.customer_email, 254))}</p>
      <p><strong>Phone:</strong> ${escapeHtml(clip(data.customer_phone, 32))}</p>
      <p><strong>Payment:</strong> ${data.payment_method === "upi" ? "UPI" : "Cash on Delivery"}</p>
      <p><strong>Ship To:</strong> ${escapeHtml(clip(data.shipping_address, 500))}</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <thead><tr style="background:#f5f0eb"><th style="padding:6px 8px;text-align:left">Item</th><th style="padding:6px 8px;text-align:center">Qty</th><th style="padding:6px 8px;text-align:right">Price</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p>Sub-Total: ₹${subtotal.toLocaleString("en-IN")} | Shipping: ₹${shipping} | <strong>Total: ₹${total.toLocaleString("en-IN")}</strong></p>
    </div>
  `;
}

function buildQueryEmailHtml(data: any): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
      <h2 style="color:#333;border-bottom:2px solid #c17f59;padding-bottom:8px">💬 New Query Received</h2>
      <p><strong>Name:</strong> ${escapeHtml(clip(data.name, 100))}</p>
      <p><strong>Email:</strong> ${escapeHtml(clip(data.email, 254))}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(clip(data.phone, 32))}</p>` : ""}
      ${data.city ? `<p><strong>City:</strong> ${escapeHtml(clip(data.city, 100))}</p>` : ""}
      <p><strong>Message:</strong></p>
      <div style="background:#f5f0eb;padding:12px;border-radius:4px;white-space:pre-wrap">${escapeHtml(clip(data.message, 2000))}</div>
    </div>
  `;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const type = body?.type;

    if (type !== "order" && type !== "query") {
      return new Response(JSON.stringify({ success: false, error: "Invalid type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auth gate:
    // - "order" emails must come from our trusted server (create-order edge function)
    //   and present a shared secret. This blocks anonymous spam to admin inbox.
    // - "query" emails come from the public contact/gift forms; we restrict by Origin
    //   allow-list and enforce strict per-field length limits + HTML escaping below.
    if (type === "order") {
      const provided = req.headers.get("x-internal-secret") || "";
      const expected = Deno.env.get("INTERNAL_NOTIFY_SECRET") || "";
      if (!expected || provided !== expected) {
        return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      const origin = req.headers.get("origin") || "";
      if (!ALLOWED_ORIGINS.includes(origin)) {
        return new Response(JSON.stringify({ success: false, error: "Forbidden" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Strict validation for public contact form
      const name = clip(body.name, 100).trim();
      const email = clip(body.email, 254).trim();
      const message = clip(body.message, 2000).trim();
      if (!name || name.length < 2) {
        return new Response(JSON.stringify({ success: false, error: "Invalid name" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!isValidEmail(email)) {
        return new Response(JSON.stringify({ success: false, error: "Invalid email" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!message || message.length < 2) {
        return new Response(JSON.stringify({ success: false, error: "Invalid message" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const subject =
      type === "order"
        ? `New Order ${clip(body.order_number, 64)} — ₹${Number(body.total || 0).toLocaleString("en-IN")}`
        : `New Query from ${clip(body.name, 100)}`;

    const html =
      type === "order" ? buildOrderEmailHtml(body) : buildQueryEmailHtml(body);

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, warning: "Email service not configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BougainQila <onboarding@resend.dev>",
        to: [NOTIFY_EMAIL],
        subject,
        html,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Resend error:", errText);
      return new Response(
        JSON.stringify({ success: false, warning: "Email delivery failed" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Notification error:", err);
    return new Response(
      JSON.stringify({ success: false, warning: "Internal error" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
