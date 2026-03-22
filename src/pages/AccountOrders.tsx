import { useAuth } from "@/hooks/useAuth";
import { Navigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Package, User, ShoppingBag } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Placed", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  processing: { label: "Processing", color: "bg-indigo-100 text-indigo-800" },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  refunded: { label: "Refunded", color: "bg-gray-100 text-gray-800" },
};

const AccountOrders = () => {
  const { user, loading } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(name, slug, product_images(image_url, display_order)))")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) return <Navigate to="/account/login" replace />;

  const getStatusBadge = (status: string) => {
    const s = STATUS_LABELS[status] || { label: status, color: "bg-muted text-muted-foreground" };
    return <span className={`text-[10px] px-2.5 py-0.5 rounded-full ${s.color}`}>{s.label}</span>;
  };

  const getProductImage = (item: any) => {
    const images = item.products?.product_images;
    if (images && images.length > 0) {
      const sorted = [...images].sort((a: any, b: any) => a.display_order - b.display_order);
      return sorted[0].image_url;
    }
    return "/placeholder.svg";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="My Orders | BougenQila" description="View your order history and track delivery status." />
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-4 md:px-6 py-12 w-full">
        <h1
          className="text-2xl md:text-3xl font-light text-foreground mb-8"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          My Account
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <Link
            to="/account"
            className="text-xs tracking-[0.15em] uppercase pb-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors"
          >
            <User className="w-3.5 h-3.5 inline mr-1" />
            Profile
          </Link>
          <Link
            to="/account/orders"
            className="text-xs tracking-[0.15em] uppercase pb-3 border-b-2 border-primary text-foreground"
          >
            <Package className="w-3.5 h-3.5 inline mr-1" />
            Orders
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm mb-4">You haven't placed any orders yet</p>
            <Link
              to="/shop"
              className="bg-primary text-primary-foreground px-8 py-3 text-xs tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order.id} className="border border-border rounded-sm overflow-hidden">
                {/* Order Header */}
                <div className="bg-muted/50 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-foreground">{order.order_number}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Order Items */}
                <div className="px-4 py-3 space-y-3">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <img
                        src={getProductImage(item)}
                        alt={item.product_name}
                        className="w-14 h-14 object-cover rounded-sm border border-border flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × ₹{item.unit_price.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <p className="text-sm text-foreground font-medium flex-shrink-0">
                        ₹{item.total_price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="border-t border-border px-4 py-3 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {order.order_items?.length || 0} item{order.order_items?.length !== 1 ? "s" : ""}
                    {order.shipping_fee > 0 && ` · Shipping ₹${order.shipping_fee}`}
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    Total: ₹{order.total.toLocaleString("en-IN")}
                  </div>
                </div>

                {/* Tracking */}
                {order.tracking_number && (
                  <div className="border-t border-border px-4 py-2 bg-muted/30">
                    <p className="text-xs text-muted-foreground">
                      Tracking: <span className="text-foreground font-medium">{order.tracking_number}</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AccountOrders;
