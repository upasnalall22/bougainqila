import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit, Upload, X, Save } from "lucide-react";
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
  description: "",
  design_craft: "",
  price: 0,
  original_price: null as number | null,
  category: "windchimes",
  colors: [] as Array<{ name: string; hex: string }>,
  in_stock: true,
  ships_within: "3-5 business days",
  tag: "",
  featured: false,
};

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [newColor, setNewColor] = useState({ name: "", hex: "#8B4513" });

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
        description: form.description || null,
        design_craft: form.design_craft || null,
        price: form.price,
        original_price: form.original_price || null,
        category: form.category,
        colors: form.colors as any,
        in_stock: form.in_stock,
        ships_within: form.ships_within || null,
        tag: form.tag || null,
        featured: form.featured,
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

  const startEdit = (product: any) => {
    setEditing(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      design_craft: product.design_craft || "",
      price: product.price,
      original_price: product.original_price,
      category: product.category,
      colors: (product.colors as Array<{ name: string; hex: string }>) || [],
      in_stock: product.in_stock,
      ships_within: product.ships_within || "",
      tag: product.tag || "",
      featured: product.featured,
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

        {/* Form */}
        <div className="bg-card border border-border rounded-sm p-6 mb-10">
          <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">
            {editing ? "Edit Product" : "Add New Product"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Design & Craft</label>
            <textarea
              value={form.design_craft}
              onChange={(e) => setForm({ ...form, design_craft: e.target.value })}
              rows={3}
              className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                  checked={form.in_stock}
                  onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                />
                In Stock
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                Featured
              </label>
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
              accept="image/*"
              onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
              className="text-sm text-muted-foreground"
            />
            {imageFiles.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">{imageFiles.length} file(s) selected</p>
            )}
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
                    {product.category} · MRP ₹{product.price.toLocaleString("en-IN")}.00
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
