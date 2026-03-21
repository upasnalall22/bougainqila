import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Copy } from "lucide-react";

const SHIPPING_COST = 100;
const FREE_SHIPPING_THRESHOLD = 800;

const UPI_ID = "kavely@upi"; // Replace with actual UPI ID

interface ShippingForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const emptyForm: ShippingForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<ShippingForm>(emptyForm);
  const [placing, setPlacing] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const copyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setPlacing(true);

    try {
      // 1. Create or find customer
      const { data: existingCustomer } = await supabase
        .from("customers")
        .select("id")
        .eq("phone", form.phone)
        .maybeSingle();

      let customerId: string;
      if (existingCustomer) {
        customerId = existingCustomer.id;
        await supabase.from("customers").update({
          name: form.name,
          email: form.email,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        }).eq("id", customerId);
      } else {
        const { data: newCustomer, error: custErr } = await supabase
          .from("customers")
          .insert({
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          })
          .select("id")
          .single();
        if (custErr || !newCustomer) throw new Error("Could not create customer");
        customerId = newCustomer.id;
      }

      // 2. Create order (UPI only)
      const shippingAddress = `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          customer_id: customerId,
          subtotal,
          shipping_cost: shipping,
          shipping_fee: shipping,
          total,
          payment_method: "upi",
          payment_status: "pending",
          shipping_address: shippingAddress,
          notes: `Customer: ${form.name}, Phone: ${form.phone}, Email: ${form.email}`,
        })
        .select("id, order_number")
        .single();

      if (orderErr || !order) throw new Error("Could not create order");

      // 3. Insert order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity,
      }));

      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw new Error("Could not save order items");

      // 4. Send notification email (non-blocking, never throw)
      supabase.functions.invoke("send-order-notification", {
        body: {
          type: "order",
          order_number: order.order_number,
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          shipping_address: shippingAddress,
          payment_method: "upi",
          items: items.map((i) => ({
            name: i.product.name,
            quantity: i.quantity,
            price: i.product.price,
          })),
          subtotal,
          shipping,
          total,
        },
      }).catch(() => {});

      // 5. Clear cart & redirect to thank you page
      await clearCart();
      navigate(`/thank-you?order=${encodeURIComponent(order.order_number)}&total=${total}&shipping=${shipping}&items=${items.length}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-primary text-primary-foreground px-8 py-3 text-xs tracking-widest uppercase hover:opacity-90 transition-opacity rounded-sm"
            >
              Shop Now
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 md:px-6 py-12 w-full">
        <h1
          className="text-2xl md:text-3xl font-light text-foreground mb-8"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Checkout
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Shipping + Payment */}
          <div className="space-y-6">
            {/* Shipping */}
            <div>
              <h2 className="text-sm tracking-[0.2em] uppercase text-foreground mb-4">Shipping Details</h2>
              <div className="space-y-3">
                {[
                  { name: "name", label: "Full Name", type: "text", required: true },
                  { name: "email", label: "Email", type: "email", required: true },
                  { name: "phone", label: "Phone", type: "tel", required: true },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">{f.label}</label>
                    <input
                      name={f.name}
                      type={f.type}
                      required={f.required}
                      value={form[f.name as keyof ShippingForm]}
                      onChange={handleChange}
                      className="w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Address</label>
                  <textarea
                    name="address"
                    required
                    rows={2}
                    value={form.address}
                    onChange={handleChange}
                    className="w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground rounded-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: "city", label: "City" },
                    { name: "state", label: "State" },
                    { name: "pincode", label: "Pincode" },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">{f.label}</label>
                      <input
                        name={f.name}
                        type="text"
                        required
                        value={form[f.name as keyof ShippingForm]}
                        onChange={handleChange}
                        className="w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment - UPI Only */}
            <div>
              <h2 className="text-sm tracking-[0.2em] uppercase text-foreground mb-4">Payment Method</h2>
              <div className="border border-primary bg-primary/5 rounded-sm px-4 py-3">
                <p className="text-sm text-foreground font-medium">UPI Payment</p>
                <p className="text-xs text-muted-foreground">Pay via Google Pay, PhonePe, Paytm, etc.</p>
              </div>

              <div className="mt-3 border border-border rounded-sm p-4 bg-card">
                <p className="text-xs text-muted-foreground mb-2">Send payment to this UPI ID:</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{UPI_ID}</span>
                  <button type="button" onClick={copyUPI} className="text-primary hover:opacity-70">
                    <Copy className="w-4 h-4" />
                  </button>
                  {upiCopied && <span className="text-xs text-green-600">Copied!</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Amount: <span className="font-medium text-foreground">₹{total.toLocaleString("en-IN")}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div>
            <div className="border border-border rounded-sm p-5 bg-card sticky top-24">
              <h2 className="text-sm tracking-[0.2em] uppercase text-foreground mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-sm border border-border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm text-foreground">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sub-Total</span>
                  <span className="text-foreground">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Free shipping on orders ₹{FREE_SHIPPING_THRESHOLD}+
                  </p>
                )}
                {shipping === 0 && (
                  <p className="text-xs text-green-600">
                    ✓ Free shipping applied
                  </p>
                )}
                <div className="flex justify-between text-sm font-medium pt-2 border-t border-border mt-2">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={placing}
                className="w-full bg-primary text-primary-foreground py-3 mt-5 text-xs tracking-widest uppercase hover:opacity-90 transition-opacity rounded-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {placing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
