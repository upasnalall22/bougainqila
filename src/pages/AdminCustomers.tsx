import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, X, Save, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import CustomerFormFields, {
  type CustomerFormData,
  type CustomerFormErrors,
  emptyCustomerForm,
  validateCustomerForm,
} from "@/components/CustomerFormFields";

const AdminCustomers = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CustomerFormData>(emptyCustomerForm);
  const [errors, setErrors] = useState<CustomerFormErrors>({});
  const [notes, setNotes] = useState("");
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

  const handleBlurValidate = (field: keyof CustomerFormErrors) => {
    const allErrors = validateCustomerForm(form);
    setErrors((prev) => ({ ...prev, [field]: allErrors[field] }));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const validationErrors = validateCustomerForm(form);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) throw new Error("Validation failed");

      const fullName = [form.salutation, form.firstName, form.lastName].filter(Boolean).join(" ");
      const phone = "+91" + form.mobile.replace(/\s/g, "");

      const customerData = {
        name: fullName,
        salutation: form.salutation,
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim() || null,
        email: form.email.trim() || null,
        phone,
        address: form.address || null,
        city: form.city || null,
        state: form.state || null,
        pincode: form.pincode || null,
        notes: notes || null,
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
      setForm(emptyCustomerForm);
      setNotes("");
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
    // Parse existing name into parts
    const nameParts = (c.name || "").split(" ");
    let salutation = c.salutation || "";
    let firstName = c.first_name || "";
    let lastName = c.last_name || "";
    if (!firstName && nameParts.length > 0) {
      if (["Mr.", "Ms."].includes(nameParts[0])) {
        salutation = nameParts[0];
        firstName = nameParts[1] || "";
        lastName = nameParts.slice(2).join(" ");
      } else {
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(" ");
      }
    }
    const phone = (c.phone || "").replace(/^\+91/, "");
    setForm({
      salutation: salutation || "Mr.",
      firstName,
      lastName,
      email: c.email || "",
      mobile: phone,
      city: c.city || "",
      state: c.state || "",
      pincode: c.pincode || "",
      address: c.address || "",
    });
    setNotes(c.notes || "");
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
            onClick={() => { setShowForm(true); setEditing(null); setForm(emptyCustomerForm); setNotes(""); setErrors({}); }}
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
              <button onClick={() => { setShowForm(false); setEditing(null); setForm(emptyCustomerForm); setErrors({}); }}><X className="w-4 h-4" /></button>
            </div>

            <CustomerFormFields
              form={form}
              onChange={setForm}
              errors={errors}
              onBlurValidate={handleBlurValidate}
              showAddress
            />

            <div className="mt-4">
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="mt-4 bg-primary text-primary-foreground px-6 py-2.5 text-xs tracking-[0.15em] uppercase rounded-sm hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
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
