import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";
import { trackPurchase } from "@/lib/analytics";
import SEOHead from "@/components/SEOHead";

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderNumber = searchParams.get("order") || "";
  const total = parseFloat(searchParams.get("total") || "0");
  const itemCount = parseInt(searchParams.get("items") || "0", 10);
  const shipping = parseFloat(searchParams.get("shipping") || "0");
  const itemsDataRaw = searchParams.get("itemsData");

  // Issue 17: fire trackPurchase with real product data
  useEffect(() => {
    if (orderNumber && total > 0) {
      let purchaseItems: Array<{ id: string; name: string; price: number; quantity: number }> = [];
      if (itemsDataRaw) {
        try {
          purchaseItems = JSON.parse(decodeURIComponent(itemsDataRaw));
        } catch {
          // fallback
        }
      }
      if (purchaseItems.length === 0) {
        purchaseItems = [{ id: "unknown", name: `Order ${orderNumber}`, price: total - shipping, quantity: itemCount || 1 }];
      }
      trackPurchase({
        id: orderNumber,
        value: total,
        shipping,
        items: purchaseItems,
      });
    }
  }, [orderNumber, total, shipping, itemCount, itemsDataRaw]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Thank You | BougainQila"
        description="Your order has been placed successfully."
        noindex
      />
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-md">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1
            className="text-2xl md:text-3xl font-light text-foreground mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Thank You for Your Order!
          </h1>

          {orderNumber && (
            <p className="text-muted-foreground text-sm mb-2">
              Order Number: <span className="font-medium text-foreground">{orderNumber}</span>
            </p>
          )}

          {total > 0 && (
            <p className="text-muted-foreground text-sm mb-2">
              Total: <span className="font-medium text-foreground">₹{total.toLocaleString("en-IN")}</span>
            </p>
          )}

          <p className="text-muted-foreground text-xs mb-2">
            Please complete your UPI payment to confirm the order. We'll send you a confirmation shortly.
          </p>

          <div className="bg-muted border border-border rounded-sm p-4 mt-4 mb-6">
            <p className="text-xs text-muted-foreground mb-1">What happens next?</p>
            <ul className="text-xs text-muted-foreground space-y-1 text-left">
              <li>• You'll receive an order confirmation via email</li>
              <li>• Our team will verify payment and process your order</li>
              <li>• You'll get shipping updates with tracking details</li>
            </ul>
          </div>

          <button
            onClick={() => navigate("/shop")}
            className="bg-primary text-primary-foreground px-8 py-3 text-xs tracking-widest uppercase hover:opacity-90 transition-opacity rounded-sm"
          >
            Continue Shopping
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThankYou;
