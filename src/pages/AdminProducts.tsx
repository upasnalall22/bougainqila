import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit, Upload, X, Save, FileUp, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

const categories = [
  { label: "Windchimes", value: "windchimes" },
  { label: "Letterings", value: "letterings" },
  { label: "Containers", value: "containers" },
  { label: "Hair Accents", value: "hair-accents" },
  { label: "Gift Set", value: "gift-set" },
];

const emptyProduct = {
  name: "",
  slug: "",
  product_code: "",
  description: "",
  design_craft: "",
  size: "",
  price: 0,
  original_price: null as number | null,
  category: "windchimes",
  colors: [] as Array<{ name: string; hex: string }>,
  in_stock: true,
  stock_quantity: 0,
  ships_within: "3-5 business days",
  tag: "",
  featured: false,
  best_seller: false,
  meta_title: "",
  meta_description: "",
};

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return lines.slice(1).map((line) => {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === "," && !inQuotes) { values.push(current.trim()); current = ""; continue; }
      current += ch;
    }
    values.push(current.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] || ""; });
    return row;
  });
}

const CSV_TEMPLATE_HEADERS = [
  "name", "slug", "description", "materials_used", "size", "price",
  "original_price", "category", "stock_quantity", "ships_within",
  "tag", "featured", "best_seller", "meta_title", "meta_description"
];

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [newColor, setNewColor] = useState({ name: "", hex: "#8B4513" });
  const csvInputRef = useRef<HTMLInputElement>(null);
  const [csvStatus, setCsvStatus] = useState<{ uploading: boolean; result: string | null }>({ uploading: false, result: null });

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_images(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const productData = {
        name: form.name,
        slug,
        product_code: form.product_code || null,
        description: form.description || null,
        design_craft: form.design_craft || null,
        size: form.size || null,
        price: form.price,
        original_price: form.original_price || null,
        category: form.category,
        colors: form.colors as any,
        in_stock: form.stock_quantity > 0,
        stock_quantity: form.stock_quantity,
        ships_within: form.ships_within || null,
        tag: form.tag || null,
        featured: form.featured,
        best_seller: form.best_seller,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
      };

      let productId: string;

      if (editing) {
        const { error } = await supabase.from("products").update(productData).eq("id", editing);
        if (error) throw error;
        productId = editing;
      } else {
        const { data, error } = await supabase.from("products").insert(productData).select().single();
        if (error) throw error;
        productId = data.id;
      }

      // Upload images
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const filePath = `${productId}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath);

        await supabase.from("product_images").insert({
          product_id: productId,
          image_url: urlData.publicUrl,
          display_order: i,
        });
      }

      return productId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setEditing(null);
      setForm(emptyProduct);
      setImageFiles([]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const { error } = await supabase.from("product_images").delete().eq("id", imageId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  const handleCSVUpload = async (file: File) => {
    setCsvStatus({ uploading: true, result: null });
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      if (rows.length === 0) { setCsvStatus({ uploading: false, result: "CSV is empty or has no data rows." }); return; }

      const products = rows.map((r) => {
        const slug = (r.slug || r.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const stockQty = parseInt(r.stock_quantity || "0", 10) || 0;
        return {
          name: r.name,
          slug,
          description: r.description || null,
          design_craft: r.materials_used || r.design_craft || null,
          size: r.size || null,
          price: parseFloat(r.price) || 0,
          original_price: r.original_price ? parseFloat(r.original_price) : null,
          category: r.category || "windchimes",
          stock_quantity: stockQty,
          in_stock: stockQty > 0,
          ships_within: r.ships_within || "3-5 business days",
          tag: r.tag || null,
          featured: r.featured?.toLowerCase() === "true",
          best_seller: r.best_seller?.toLowerCase() === "true",
          meta_title: r.meta_title || null,
          meta_description: r.meta_description || null,
        };
      }).filter((p) => p.name && p.price > 0);

      if (products.length === 0) { setCsvStatus({ uploading: false, result: "No valid products found. Ensure 'name' and 'price' columns exist." }); return; }

      const { error } = await supabase.from("products").insert(products);
      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setCsvStatus({ uploading: false, result: `Successfully imported ${products.length} product(s).` });
    } catch (err: any) {
      setCsvStatus({ uploading: false, result: `Error: ${err.message}` });
    }
  };

  const downloadTemplate = () => {
    const csv = CSV_TEMPLATE_HEADERS.join(",") + "\n" +
      "Example Product,,A beautiful handcrafted item,Wood and brass,10cm x 15cm,1499,1999,windchimes,10,3-5 business days,New,false,false,,\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "products_template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const startEdit = (product: any) => {
    setEditing(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      product_code: product.product_code || "",
      description: product.description || "",
      design_craft: product.design_craft || "",
      size: product.size || "",
      price: product.price,
      original_price: product.original_price,
      category: product.category,
      colors: (product.colors as Array<{ name: string; hex: string }>) || [],
      in_stock: product.in_stock,
      stock_quantity: product.stock_quantity || 0,
      ships_within: product.ships_within || "",
      tag: product.tag || "",
      featured: product.featured,
      best_seller: product.best_seller || false,
      meta_title: product.meta_title || "",
      meta_description: product.meta_description || "",
    });
    setImageFiles([]);
  };

  const addColor = () => {
    if (newColor.name) {
      setForm({ ...form, colors: [...form.colors, { ...newColor }] });
      setNewColor({ name: "", hex: "#8B4513" });
    }
  };

  const removeColor = (i: number) => {
    setForm({ ...form, colors: form.colors.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 md:px-6 py-10 w-full">
        <h1 className="text-2xl md:text-3xl font-light text-foreground mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Product Management
        </h1>

        {/* CSV Bulk Upload */}
        <div className="bg-card border border-border rounded-sm p-6 mb-6">
          <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">Bulk Import via CSV</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Upload a CSV file to import multiple products at once. Download the template to see the required format.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={downloadTemplate}
              className="border border-border px-4 py-2 text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-muted transition-colors inline-flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              Download Template
            </button>
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCSVUpload(file);
                e.target.value = "";
              }}
            />
            <button
              onClick={() => csvInputRef.current?.click()}
              disabled={csvStatus.uploading}
              className="bg-primary text-primary-foreground px-4 py-2 text-xs tracking-[0.15em] uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2"
            >
              <FileUp className="w-3.5 h-3.5" />
              {csvStatus.uploading ? "Importing..." : "Upload CSV"}
            </button>
          </div>
          {csvStatus.result && (
            <p className={`text-xs mt-3 ${csvStatus.result.startsWith("Error") ? "text-destructive" : "text-green-600"}`}>
              {csvStatus.result}
            </p>
          )}
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-sm p-6 mb-10">
          <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">
            {editing ? "Edit Product" : "Add New Product"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Product Code</label>
              <input
                type="text"
                value={form.product_code}
                onChange={(e) => setForm({ ...form, product_code: e.target.value })}
                placeholder="e.g. BQ-WC-001"
                className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="auto-generated from name"
                className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div className="mb-4">
            <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Materials Used</label>
            <textarea
              value={form.design_craft}
              onChange={(e) => setForm({ ...form, design_craft: e.target.value })}
              rows={3}
              className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div className="mb-4">
            <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Size</label>
            <input
              type="text"
              value={(form as any).size || ""}
              onChange={(e) => setForm({ ...form, size: e.target.value } as any)}
              placeholder="e.g. 10cm x 15cm"
              className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Price (₹) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Original Price (₹)</label>
              <input
                type="number"
                value={form.original_price || ""}
                onChange={(e) => setForm({ ...form, original_price: e.target.value ? Number(e.target.value) : null })}
                className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Stock Qty *</label>
              <input
                type="number"
                min={0}
                value={form.stock_quantity}
                onChange={(e) => setForm({ ...form, stock_quantity: Number(e.target.value) })}
                className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Tag</label>
              <input
                type="text"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                placeholder="e.g. Bestseller, New"
                className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Ships Within</label>
              <input
                type="text"
                value={form.ships_within}
                onChange={(e) => setForm({ ...form, ships_within: e.target.value })}
                className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.best_seller}
                  onChange={(e) => setForm({ ...form, best_seller: e.target.checked })}
                />
                Best Seller
              </label>
            </div>
          </div>

          {/* SEO Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Meta Title</label>
              <input
                type="text"
                value={form.meta_title}
                onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                placeholder="SEO title (optional)"
                className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Meta Description</label>
              <input
                type="text"
                value={form.meta_description}
                onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                placeholder="SEO description (optional)"
                className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Colors */}
          <div className="mb-4">
            <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-2">Colours</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.colors.map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1 border border-border rounded-sm px-2 py-1 text-xs">
                  <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: c.hex }} />
                  {c.name}
                  <button onClick={() => removeColor(i)} className="ml-1"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newColor.name}
                onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                placeholder="Color name"
                className="border border-border bg-background px-3 py-1.5 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="color"
                value={newColor.hex}
                onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                className="w-10 h-9 border border-border rounded-sm cursor-pointer"
              />
              <button onClick={addColor} className="border border-border px-3 py-1.5 text-xs rounded-sm hover:bg-muted transition-colors">
                Add
              </button>
            </div>
          </div>

          {/* Images */}
          <div className="mb-6">
            <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-2">Product Images</label>

            {/* Existing images (when editing) */}
            {editing && products && (() => {
              const p = products.find((p: any) => p.id === editing);
              const existingImages = (p as any)?.product_images || [];
              return existingImages.length > 0 ? (
                <div className="flex gap-2 mb-3 flex-wrap">
                  {existingImages.map((img: any) => (
                    <div key={img.id} className="relative w-20 h-20">
                      <img src={img.image_url} alt="" className="w-full h-full object-cover rounded-sm border border-border" />
                      <button
                        onClick={() => deleteImageMutation.mutate(img.id)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null;
            })()}

            <input
              type="file"
              multiple
              accept="image/*,image/gif"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const existingCount = editing
                  ? (products?.find((p: any) => p.id === editing) as any)?.product_images?.length || 0
                  : 0;
                const allowed = 5 - existingCount;
                if (files.length > allowed) {
                  alert(`You can upload up to ${allowed} more image(s). Max 5 total.`);
                  setImageFiles(files.slice(0, allowed));
                } else {
                  setImageFiles(files);
                }
              }}
              className="text-sm text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {imageFiles.length > 0
                ? `${imageFiles.length} file(s) selected`
                : "Upload up to 5 images or GIFs"}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !form.name || !form.price}
              className="bg-primary text-primary-foreground px-6 py-2.5 text-xs tracking-[0.15em] uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              {saveMutation.isPending ? "Saving..." : editing ? "Update Product" : "Add Product"}
            </button>
            {editing && (
              <button
                onClick={() => { setEditing(null); setForm(emptyProduct); setImageFiles([]); }}
                className="border border-border px-6 py-2.5 text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
          {saveMutation.isError && (
            <p className="text-destructive text-xs mt-2">Error: {(saveMutation.error as Error).message}</p>
          )}
        </div>

        {/* Product List */}
        <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">All Products</h2>
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : (
          <div className="space-y-3">
            {products?.map((product: any) => (
              <div key={product.id} className="border border-border rounded-sm p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-sm overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={product.product_images?.[0]?.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground truncate">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {product.product_code && <span className="font-mono">{product.product_code} · </span>}
                    {product.category} · MRP ₹{product.price.toLocaleString("en-IN")}.00
                    · Stock: {(product as any).stock_quantity ?? 0}
                    {product.tag && ` · ${product.tag}`}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(product)} className="text-foreground hover:text-primary transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { if (confirm("Delete this product?")) deleteMutation.mutate(product.id); }}
                    className="text-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {products?.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-8">No products yet. Add your first product above.</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminProducts;
