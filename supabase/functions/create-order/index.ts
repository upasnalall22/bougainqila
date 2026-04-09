import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SHIPPING_COST = 100;
const FREE_SHIPPING_THRESHOLD = 800;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      salutation,
      firstName,
      lastName,
      email,
      mobile,
      address,
      city,
      state,
      pincode,
      items, // Array of { product_id: string, quantity: number }
    } = body;

    // --- Input validation ---
    if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
      return jsonError("First name is required", 400);
    }
    if (!email || typeof email !== "string" || !/\S+@\S+\.\S+/.test(email)) {
      return jsonError("Valid email is required", 400);
    }
    if (!mobile || typeof mobile !== "string" || !/^\d{10,12}$/.test(mobile.replace(/\s/g, ""))) {
      return jsonError("Valid 10-digit mobile is required", 400);
    }
    if (!Array.isArray(items) || items.length === 0) {
      return jsonError("Cart items are required", 400);
    }
    for (const item of items) {
      if (!item.product_id || typeof item.quantity !== "number" || item.quantity < 1) {
        return jsonError("Each item must have product_id and quantity >= 1", 400);
      }
    }

    // --- Use service role to bypass RLS ---
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // --- Fetch real prices from products table ---
    const productIds = items.map((i: any) => i.product_id);
    const { data: products, error: prodErr } = await supabase
      .from("products")
      .select("id, name, slug, price, in_stock, stock_quantity")
      .in("id", productIds);

    if (prodErr || !products) {
      return jsonError("Failed to fetch products", 500);
    }

    const productMap = new Map(products.map((p: any) => [p.id, p]));

    // Validate all products exist and are in stock
    for (const item of items) {
      const product = productMap.get(item.product_id);
      if (!product) {
        return jsonError(`Product not found: ${item.product_id}`, 400);
      }
      if (!product.in_stock || product.stock_quantity < item.quantity) {
        return jsonError(`Product "${product.name}" is out of stock`, 400);
      }
    }

    // --- Calculate totals using server-side prices ---
    let subtotal = 0;
    const orderItemsData = items.map((item: any) => {
      const product = productMap.get(item.product_id)!;
      const totalPrice = product.price * item.quantity;
      subtotal += totalPrice;
      return {
        product_id: item.product_id,
        product_name: product.name,
        quantity: item.quantity,
        unit_price: product.price,
        total_price: totalPrice,
      };
    });

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;

    // --- Create or update customer ---
    const phone = "+91" + mobile.replace(/\s/g, "");
    const fullName = [salutation, firstName.trim(), lastName?.trim()].filter(Boolean).join(" ");

    const { data: existingCustomers } = await supabase.rpc("find_customer_by_phone", { _phone: phone });
    const existingCustomer = existingCustomers && existingCustomers.length > 0 ? existingCustomers[0] : null;

    const customerData = {
      name: fullName,
      salutation: salutation || null,
      first_name: firstName.trim(),
      last_name: lastName?.trim() || null,
      email: email.trim(),
      phone,
      address: address || null,
      city: city || null,
      state: state || null,
      pincode: pincode || null,
    };

    let customerId: string;
    if (existingCustomer) {
      customerId = existingCustomer.id;
      await supabase.from("customers").update(customerData).eq("id", customerId);
    } else {
      const { data: newCustomer, error: custErr } = await supabase
        .from("customers")
        .insert(customerData)
        .select("id")
        .single();
      if (custErr || !newCustomer) {
        console.error("Customer insert error:", custErr);
        return jsonError("Could not create customer", 500);
      }
      customerId = newCustomer.id;
    }

    // --- Create order ---
    const shippingAddress = [address, city, state, pincode].filter(Boolean).join(", ");
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        customer_id: customerId,
        user_id: null,
        subtotal,
        shipping_cost: shipping,
        shipping_fee: shipping,
        total,
        payment_method: "upi",
        payment_status: "pending",
        status: "pending",
        shipping_address: shippingAddress,
        notes: `Customer: ${fullName}, Phone: ${phone}, Email: ${email}`,
      })
      .select("id, order_number")
      .single();

    if (orderErr || !order) {
      console.error("Order insert error:", orderErr);
      return jsonError("Could not create order", 500);
    }

    // --- Create order items ---
    const orderItems = orderItemsData.map((oi: any) => ({
      ...oi,
      order_id: order.id,
    }));

    const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
    if (itemsErr) {
      console.error("Order items insert error:", itemsErr);
      return jsonError("Could not save order items", 500);
    }

    // --- Send notification email (non-blocking) ---
    try {
      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      if (RESEND_API_KEY) {
        const itemsHtml = orderItemsData
          .map((i: any) =>
            `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee">${i.product_name}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">₹${i.unit_price.toLocaleString("en-IN")}</td></tr>`
          )
          .join("");

        const html = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
            <h2 style="color:#333;border-bottom:2px solid #c17f59;padding-bottom:8px">🛒 New Order Received</h2>
            <p><strong>Order:</strong> ${order.order_number}</p>
            <p><strong>Customer:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Payment:</strong> UPI</p>
            <p><strong>Ship To:</strong> ${shippingAddress}</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              <thead><tr style="background:#f5f0eb"><th style="padding:6px 8px;text-align:left">Item</th><th style="padding:6px 8px;text-align:center">Qty</th><th style="padding:6px 8px;text-align:right">Price</th></tr></thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <p>Sub-Total: ₹${subtotal.toLocaleString("en-IN")} | Shipping: ₹${shipping} | <strong>Total: ₹${total.toLocaleString("en-IN")}</strong></p>
          </div>
        `;

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "BougainQila <onboarding@resend.dev>",
            to: ["studio@bougainqila.com"],
            subject: `New Order ${order.order_number} — ₹${total.toLocaleString("en-IN")}`,
            html,
          }),
        });
      }
    } catch (emailErr) {
      console.error("Email notification failed (non-blocking):", emailErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        order_number: order.order_number,
        total,
        subtotal,
        shipping,
        items_count: items.length,
        items: orderItemsData.map((oi: any) => ({
          id: oi.product_id,
          name: oi.product_name,
          price: oi.unit_price,
          quantity: oi.quantity,
        })),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("create-order error:", err);
    return jsonError("Internal server error", 500);
  }
});

function jsonError(message: string, status: number) {
  return new Response(
    JSON.stringify({ success: false, error: message }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
