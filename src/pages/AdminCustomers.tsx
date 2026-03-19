import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, X, Save, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const emptyCustomer = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  notes: "",
};

const AdminCustomers = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyCustomer);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: customers, isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*, orders(id, order_number, total, status, created_at)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const customerData = {
        name: form.name,
        email: form.email || null,
        phone: form.phone,
        address: form.address || null,
        city: form.city || null,
        state: form.state || null,
        pincode: form.pincode || null,
        notes: form.notes || null,
      };

      if (editing) {
        const { error } = await supabase.from("customers").update(customerData).eq("id", editing);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("customers").insert(customerData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      setEditing(null);
      setShowForm(false);
      setForm(emptyCustomer);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("customers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-customers"] }),
  });

  const startEdit = (c: any) => {
    setEditing(c.id);
    setShowForm(true);
    setForm({
      name: c.name,
      email: c.email || "",
      phone: c.phone,
      address: c.address || "",
      city: c.city || "",
      state: c.state || "",
      pincode: c.pincode || "",
      notes: c.notes || "",
    });
  };

  const filtered = customers?.filter((c: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name?.toLowerCase().includes(q) || c.phone?.includes(q) || c.email?.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 md:px-6 py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-light text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Customer Management
          </h1>
          <button
            onClick={() => { setShowForm(true); setEditing(null); setForm(emptyCustomer); }}
            className="bg-primary text-primary-foreground px-4 py-2 text-xs tracking-[0.15em] uppercase rounded-sm hover:opacity-90 inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" /> Add Customer
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, phone, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-border bg-background text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-card border border-border rounded-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground">
                {editing ? "Edit Customer" : "New Customer"}
              </h2>
              <button onClick={() => { setShowForm(false); setEditing(null); setForm(emptyCustomer); }}><X className="w-4 h-4" /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Phone *</label>
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Pincode</label>
                <input type="text" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Address</label>
              <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={2} className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">City</label>
                <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">State</label>
                <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2} className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm resize-none" />
            </div>

            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !form.name || !form.phone}
              className="bg-primary text-primary-foreground px-6 py-2.5 text-xs tracking-[0.15em] uppercase rounded-sm hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              {saveMutation.isPending ? "Saving..." : editing ? "Update" : "Add Customer"}
            </button>
          </div>
        )}

        {/* Customers List */}
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : (
          <div className="space-y-3">
            {filtered?.map((c: any) => (
              <div key={c.id} className="border border-border rounded-sm p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.phone} {c.email && `· ${c.email}`}</p>
                    {c.city && <p className="text-xs text-muted-foreground">{[c.city, c.state, c.pincode].filter(Boolean).join(", ")}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{c.orders?.length || 0} orders</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(c)} className="text-foreground hover:text-primary"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => { if (confirm("Delete customer?")) deleteMutation.mutate(c.id); }} className="text-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
            {filtered?.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No customers found.</p>}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminCustomers;
