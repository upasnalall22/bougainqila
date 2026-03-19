import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Eye, X, Package, Search, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  { value: "processing", label: "Processing", color: "bg-indigo-100 text-indigo-800" },
  { value: "shipped", label: "Shipped", color: "bg-purple-100 text-purple-800" },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
  { value: "refunded", label: "Refunded", color: "bg-gray-100 text-gray-800" },
];

const PAYMENT_METHODS = ["cod", "upi", "bank_transfer", "card", "other"];
const PAYMENT_STATUSES = ["unpaid", "paid", "partially_paid", "refunded"];

interface OrderForm {
  customer_id: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_method: string;
  payment_status: string;
  shipping_address: string;
  tracking_number: string;
  notes: string;
  items: Array<{ product_id: string; product_name: string; quantity: number; unit_price: number }>;
}

const emptyOrder: OrderForm = {
  customer_id: "",
  status: "pending",
  subtotal: 0,
  shipping_cost: 0,
  total: 0,
  payment_method: "cod",
  payment_status: "unpaid",
  shipping_address: "",
  tracking_number: "",
  notes: "",
  items: [],
};

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [viewOrder, setViewOrder] = useState<any>(null);
  const [form, setForm] = useState<OrderForm>(emptyOrder);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, customers(*), order_items(*, products(name, slug, product_code, product_images(image_url, display_order)))")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: customers } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: products } = useQuery({
    queryKey: ["admin-products-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, stock_quantity, in_stock")
        .eq("in_stock", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          customer_id: form.customer_id || null,
          status: form.status as any,
          subtotal: form.subtotal,
          shipping_cost: form.shipping_cost,
          total: form.total,
          payment_method: form.payment_method,
          payment_status: form.payment_status,
          shipping_address: form.shipping_address || null,
          tracking_number: form.tracking_number || null,
          notes: form.notes || null,
        })
        .select()
        .single();
      if (error) throw error;

      if (form.items.length > 0) {
        const itemsToInsert = form.items.map((item) => ({
          order_id: order.id,
          product_id: item.product_id || null,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price,
        }));
        const { error: itemsError } = await supabase.from("order_items").insert(itemsToInsert);
        if (itemsError) throw itemsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setShowForm(false);
      setForm(emptyOrder);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async ({ id, payment_status }: { id: string; payment_status: string }) => {
      const { error } = await supabase.from("orders").update({ payment_status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  const updateTrackingMutation = useMutation({
    mutationFn: async ({ id, tracking_number }: { id: string; tracking_number: string }) => {
      const { error } = await supabase.from("orders").update({ tracking_number }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { product_id: "", product_name: "", quantity: 1, unit_price: 0 }] });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...form.items];
    (newItems[index] as any)[field] = value;
    if (field === "product_id" && products) {
      const p = products.find((pr) => pr.id === value);
      if (p) {
        newItems[index].product_name = p.name;
        newItems[index].unit_price = p.price;
      }
    }
    const subtotal = newItems.reduce((s, i) => s + i.quantity * i.unit_price, 0);
    setForm({ ...form, items: newItems, subtotal, total: subtotal + form.shipping_cost });
  };

  const removeItem = (index: number) => {
    const newItems = form.items.filter((_, i) => i !== index);
    const subtotal = newItems.reduce((s, i) => s + i.quantity * i.unit_price, 0);
    setForm({ ...form, items: newItems, subtotal, total: subtotal + form.shipping_cost });
  };

  const filteredOrders = orders?.filter((o: any) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.order_number?.toLowerCase().includes(q) ||
        o.customers?.name?.toLowerCase().includes(q) ||
        o.customers?.phone?.includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    const s = ORDER_STATUSES.find((os) => os.value === status);
    return s ? <span className={`text-[10px] px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span> : status;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 md:px-6 py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-light text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Order Management
          </h1>
          <button
            onClick={() => { setShowForm(true); setForm(emptyOrder); }}
            className="bg-primary text-primary-foreground px-4 py-2 text-xs tracking-[0.15em] uppercase rounded-sm hover:opacity-90 inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" /> New Order
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search order #, customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-border bg-background text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-border bg-background px-3 py-2 text-sm rounded-sm"
          >
            <option value="all">All Statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Order Creation Form */}
        {showForm && (
          <div className="bg-card border border-border rounded-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground">Create New Order</h2>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4" /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Customer</label>
                <select
                  value={form.customer_id}
                  onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                  className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm"
                >
                  <option value="">Walk-in Customer</option>
                  {customers?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Payment Method</label>
                <select
                  value={form.payment_method}
                  onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                  className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>{m.replace("_", " ").toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Shipping Address</label>
              <textarea
                value={form.shipping_address}
                onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
                rows={2}
                className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm resize-none"
              />
            </div>

            {/* Order Items */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs tracking-widest uppercase text-muted-foreground">Order Items</label>
                <button onClick={addItem} className="text-xs text-primary underline">+ Add Item</button>
              </div>
              {form.items.map((item, i) => (
                <div key={i} className="flex gap-2 mb-2 items-end">
                  <div className="flex-1">
                    <select
                      value={item.product_id}
                      onChange={(e) => updateItem(i, "product_id", e.target.value)}
                      className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm"
                    >
                      <option value="">Select product</option>
                      {products?.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock_quantity})</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
                    className="w-20 border border-border bg-background px-2 py-2 text-sm rounded-sm"
                    placeholder="Qty"
                  />
                  <input
                    type="number"
                    value={item.unit_price}
                    onChange={(e) => updateItem(i, "unit_price", Number(e.target.value))}
                    className="w-24 border border-border bg-background px-2 py-2 text-sm rounded-sm"
                    placeholder="Price"
                  />
                  <button onClick={() => removeItem(i)} className="text-destructive"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Subtotal (₹)</label>
                <input type="number" value={form.subtotal} readOnly className="w-full border border-border bg-muted px-3 py-2 text-sm rounded-sm" />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Shipping (₹)</label>
                <input
                  type="number"
                  value={form.shipping_cost}
                  onChange={(e) => {
                    const sc = Number(e.target.value);
                    setForm({ ...form, shipping_cost: sc, total: form.subtotal + sc });
                  }}
                  className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm"
                />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Total (₹)</label>
                <input type="number" value={form.total} readOnly className="w-full border border-border bg-muted px-3 py-2 text-sm rounded-sm" />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm resize-none"
              />
            </div>

            <button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || form.items.length === 0}
              className="bg-primary text-primary-foreground px-6 py-2.5 text-xs tracking-[0.15em] uppercase rounded-sm hover:opacity-90 disabled:opacity-50"
            >
              {createMutation.isPending ? "Creating..." : "Create Order"}
            </button>
          </div>
        )}

        {/* Order Detail View */}
        {viewOrder && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-background border border-border rounded-sm max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium text-foreground">{viewOrder.order_number}</h2>
                  <p className="text-xs text-muted-foreground">{new Date(viewOrder.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => setViewOrder(null)}><X className="w-5 h-5" /></button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Customer</p>
                  <p className="text-sm">{viewOrder.customers?.name || "Walk-in"}</p>
                  {viewOrder.customers?.phone && <p className="text-xs text-muted-foreground">{viewOrder.customers.phone}</p>}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Status</p>
                  <select
                    value={viewOrder.status}
                    onChange={(e) => {
                      updateStatusMutation.mutate({ id: viewOrder.id, status: e.target.value });
                      setViewOrder({ ...viewOrder, status: e.target.value });
                    }}
                    className="border border-border bg-background px-2 py-1 text-sm rounded-sm mt-1"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Payment</p>
                  <p className="text-sm capitalize">{viewOrder.payment_method?.replace("_", " ")}</p>
                  <select
                    value={viewOrder.payment_status}
                    onChange={(e) => {
                      updatePaymentMutation.mutate({ id: viewOrder.id, payment_status: e.target.value });
                      setViewOrder({ ...viewOrder, payment_status: e.target.value });
                    }}
                    className="border border-border bg-background px-2 py-1 text-xs rounded-sm mt-1"
                  >
                    {PAYMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>{s.replace("_", " ").toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Tracking</p>
                  <div className="flex gap-1 mt-1">
                    <input
                      type="text"
                      defaultValue={viewOrder.tracking_number || ""}
                      onBlur={(e) => {
                        if (e.target.value !== (viewOrder.tracking_number || "")) {
                          updateTrackingMutation.mutate({ id: viewOrder.id, tracking_number: e.target.value });
                        }
                      }}
                      placeholder="Add tracking #"
                      className="border border-border bg-background px-2 py-1 text-xs rounded-sm flex-1"
                    />
                  </div>
                </div>
              </div>

              {viewOrder.shipping_address && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Shipping Address</p>
                  <p className="text-sm">{viewOrder.shipping_address}</p>
                </div>
              )}

              <div className="mb-4">
                <p className="text-xs text-muted-foreground uppercase mb-2">Items</p>
                <div className="space-y-2">
                  {viewOrder.order_items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 border border-border rounded-sm p-2">
                      <div className="w-10 h-10 bg-muted rounded-sm overflow-hidden">
                        <img
                          src={item.products?.product_images?.sort((a: any, b: any) => a.display_order - b.display_order)[0]?.image_url || "/placeholder.svg"}
                          alt="" className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{item.product_name}</p>
                        {item.products?.slug && (
                          <p className="text-[10px] text-muted-foreground font-mono">Code: {item.products.slug}</p>
                        )}
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.unit_price}</p>
                      </div>
                      <p className="text-sm font-medium">₹{item.total_price}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-3 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{viewOrder.subtotal}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>₹{viewOrder.shipping_cost}</span></div>
                <div className="flex justify-between font-medium text-base pt-1"><span>Total</span><span>₹{viewOrder.total}</span></div>
              </div>

              {viewOrder.notes && (
                <div className="mt-4 p-3 bg-muted rounded-sm">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Notes</p>
                  <p className="text-sm">{viewOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders List */}
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading orders...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-2 text-xs tracking-widest uppercase text-muted-foreground font-normal">Order #</th>
                  <th className="py-3 px-2 text-xs tracking-widest uppercase text-muted-foreground font-normal">Customer</th>
                  <th className="py-3 px-2 text-xs tracking-widest uppercase text-muted-foreground font-normal">Items</th>
                  <th className="py-3 px-2 text-xs tracking-widest uppercase text-muted-foreground font-normal">Status</th>
                  <th className="py-3 px-2 text-xs tracking-widest uppercase text-muted-foreground font-normal">Payment</th>
                  <th className="py-3 px-2 text-xs tracking-widest uppercase text-muted-foreground font-normal">Total</th>
                  <th className="py-3 px-2 text-xs tracking-widest uppercase text-muted-foreground font-normal">Date</th>
                  <th className="py-3 px-2 text-xs tracking-widest uppercase text-muted-foreground font-normal"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders?.map((order: any) => (
                  <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition-colors align-top">
                    <td className="py-3 px-2 font-medium">{order.order_number}</td>
                    <td className="py-3 px-2">{order.customers?.name || "Walk-in"}</td>
                    <td className="py-3 px-2">
                      <div className="space-y-1">
                        {order.order_items?.map((item: any) => (
                          <div key={item.id} className="text-xs">
                            <span>{item.product_name}</span>
                            {item.products?.slug && (
                              <span className="text-muted-foreground font-mono ml-1">({item.products.slug})</span>
                            )}
                            <span className="text-muted-foreground"> ×{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-2">{getStatusBadge(order.status)}</td>
                    <td className="py-3 px-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${order.payment_status === "paid" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                        {order.payment_status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-2">₹{order.total?.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-2 text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-2">
                      <button onClick={() => setViewOrder(order)} className="text-primary hover:underline text-xs">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredOrders?.length === 0 && (
                  <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">No orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminOrders;
