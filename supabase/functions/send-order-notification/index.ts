import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const NOTIFY_EMAIL = "M4marcons@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function buildOrderEmailHtml(data: any): string {
  const itemsHtml = data.items
    .map(
      (i: any) =>
        `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee">${i.name}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">₹${i.price.toLocaleString("en-IN")}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
      <h2 style="color:#333;border-bottom:2px solid #c17f59;padding-bottom:8px">🛒 New Order Received</h2>
      <p><strong>Order:</strong> ${data.order_number}</p>
      <p><strong>Customer:</strong> ${data.customer_name}</p>
      <p><strong>Email:</strong> ${data.customer_email}</p>
      <p><strong>Phone:</strong> ${data.customer_phone}</p>
      <p><strong>Payment:</strong> ${data.payment_method === "upi" ? "UPI" : "Cash on Delivery"}</p>
      <p><strong>Ship To:</strong> ${data.shipping_address}</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <thead><tr style="background:#f5f0eb"><th style="padding:6px 8px;text-align:left">Item</th><th style="padding:6px 8px;text-align:center">Qty</th><th style="padding:6px 8px;text-align:right">Price</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p>Sub-Total: ₹${data.subtotal.toLocaleString("en-IN")} | Shipping: ₹${data.shipping} | <strong>Total: ₹${data.total.toLocaleString("en-IN")}</strong></p>
    </div>
  `;
}

function buildQueryEmailHtml(data: any): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
      <h2 style="color:#333;border-bottom:2px solid #c17f59;padding-bottom:8px">💬 New Query Received</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Message:</strong></p>
      <div style="background:#f5f0eb;padding:12px;border-radius:4px;white-space:pre-wrap">${data.message}</div>
    </div>
  `;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const type = body.type; // "order" or "query"

    const subject =
      type === "order"
        ? `New Order ${body.order_number} — ₹${body.total?.toLocaleString("en-IN")}`
        : `New Query from ${body.name}`;

    const html =
      type === "order" ? buildOrderEmailHtml(body) : buildQueryEmailHtml(body);

    // Use Resend API to send email
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Kavely <onboarding@resend.dev>",
        to: [NOTIFY_EMAIL],
        subject,
        html,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Resend error:", errText);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Notification error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
