import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAllHomepageContent, useAllCategoryContent, useJournalPosts } from "@/hooks/useCMS";
import { useOurStorySections } from "@/hooks/useOurStory";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CmsImageUpload from "@/components/CmsImageUpload";
import { Save, Plus, Trash2, Edit, LogOut } from "lucide-react";

type Tab = "homepage" | "categories" | "journal" | "our-story" | "subscribers";

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("homepage");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 md:px-6 py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-light text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Content Management
          </h1>
          <button onClick={signOut} className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        <div className="flex gap-1 mb-8 border-b border-border">
          {(["homepage", "categories", "journal", "our-story", "subscribers"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs tracking-[0.15em] uppercase transition-colors border-b-2 -mb-[1px] ${
                tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "homepage" && <HomepageTab />}
        {tab === "categories" && <CategoriesTab />}
        {tab === "journal" && <JournalTab />}
        {tab === "our-story" && <OurStoryTab />}
        {tab === "subscribers" && <SubscribersTab />}
      </main>
      <Footer />
    </div>
  );
};

// Helper: renders a text/textarea field
function CmsTextField({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div>
      <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
      )}
    </div>
  );
}

// ─── Homepage Tab ─────────────────────────────────────────────
function HomepageTab() {
  const queryClient = useQueryClient();
  const { data: sections, isLoading } = useAllHomepageContent();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("homepage_content").update(form).eq("section", editing!);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["homepage-content"] }); setEditing(null); },
  });

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  const startEdit = (s: any) => {
    setEditing(s.section);
    setForm({
      title: s.title || "", subtitle: s.subtitle || "", description: s.description || "",
      button_text: s.button_text || "", button_link: s.button_link || "", image_url: s.image_url || "",
      meta_title: s.meta_title || "", meta_description: s.meta_description || "",
    });
  };

  const textFields = ["title", "subtitle", "button_text", "button_link", "meta_title"];
  const multilineFields = ["description", "meta_description"];

  return (
    <div className="space-y-4">
      {sections?.map((s: any) => (
        <div key={s.id} className="border border-border rounded-sm p-4">
          {editing === s.section ? (
            <div className="space-y-3">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Editing: {s.section}</p>
              {textFields.map((field) => (
                <CmsTextField key={field} label={field.replace(/_/g, " ")} value={form[field] || ""} onChange={(v) => setForm({ ...form, [field]: v })} />
              ))}
              {multilineFields.map((field) => (
                <CmsTextField key={field} label={field.replace(/_/g, " ")} value={form[field] || ""} onChange={(v) => setForm({ ...form, [field]: v })} multiline />
              ))}
              <CmsImageUpload label="Section Image" folder={`homepage/${s.section}`} value={form.image_url || ""} onChange={(url) => setForm({ ...form, image_url: url })} />
              <div className="flex gap-2">
                <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-primary text-primary-foreground px-5 py-2 text-xs tracking-[0.15em] uppercase rounded-sm hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1.5">
                  <Save className="w-3.5 h-3.5" /> {saveMutation.isPending ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setEditing(null)} className="border border-border px-5 py-2 text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-muted">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {s.image_url && <img src={s.image_url} alt="" className="h-12 w-12 rounded-sm object-cover border border-border" />}
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">{s.section}</p>
                  <p className="text-sm font-medium text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.subtitle}</p>
                </div>
              </div>
              <button onClick={() => startEdit(s)} className="text-foreground hover:text-primary"><Edit className="w-4 h-4" /></button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Categories Tab ────────────────────────────────────────────
function CategoriesTab() {
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useAllCategoryContent();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("category_content").update(form).eq("slug", editing!);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["all-category-content"] }); setEditing(null); },
  });

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  const startEdit = (c: any) => {
    setEditing(c.slug);
    setForm({
      name: c.name || "", description: c.description || "", banner_image_url: c.banner_image_url || "",
      meta_title: c.meta_title || "", meta_description: c.meta_description || "",
    });
  };

  return (
    <div className="space-y-4">
      {categories?.map((c: any) => (
        <div key={c.id} className="border border-border rounded-sm p-4">
          {editing === c.slug ? (
            <div className="space-y-3">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Editing: {c.slug}</p>
              <CmsTextField label="Name" value={form.name || ""} onChange={(v) => setForm({ ...form, name: v })} />
              <CmsTextField label="Description" value={form.description || ""} onChange={(v) => setForm({ ...form, description: v })} multiline />
              <CmsImageUpload label="Banner Image" folder={`categories/${c.slug}`} value={form.banner_image_url || ""} onChange={(url) => setForm({ ...form, banner_image_url: url })} />
              <CmsTextField label="Meta Title" value={form.meta_title || ""} onChange={(v) => setForm({ ...form, meta_title: v })} />
              <CmsTextField label="Meta Description" value={form.meta_description || ""} onChange={(v) => setForm({ ...form, meta_description: v })} multiline />
              <div className="flex gap-2">
                <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-primary text-primary-foreground px-5 py-2 text-xs tracking-[0.15em] uppercase rounded-sm hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1.5">
                  <Save className="w-3.5 h-3.5" /> {saveMutation.isPending ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setEditing(null)} className="border border-border px-5 py-2 text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-muted">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {c.banner_image_url && <img src={c.banner_image_url} alt="" className="h-12 w-12 rounded-sm object-cover border border-border" />}
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">{c.slug}</p>
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-md">{c.description}</p>
                </div>
              </div>
              <button onClick={() => startEdit(c)} className="text-foreground hover:text-primary"><Edit className="w-4 h-4" /></button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Journal Tab ──────────────────────────────────────────────
const TEMPLATES = [
  { value: "classic", label: "Classic", desc: "Full-width cover, text below" },
  { value: "gallery", label: "Gallery", desc: "Cover + image grid" },
  { value: "editorial", label: "Editorial", desc: "Side-by-side images & text" },
];

function JournalTab() {
  const queryClient = useQueryClient();
  const { data: posts, isLoading } = useJournalPosts(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", body: "", category: "", cover_image_url: "", published: false, meta_title: "", meta_description: "", template: "classic",
  });
  const [postImages, setPostImages] = useState<Array<{ id?: string; image_url: string; caption: string }>>([]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const payload = { ...form, slug, published_at: form.published ? new Date().toISOString() : null };
      let postId = editing;
      if (editing) {
        const { error } = await supabase.from("journal_posts").update(payload).eq("id", editing);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("journal_posts").insert(payload).select("id").single();
        if (error) throw error;
        postId = data.id;
      }

      // Sync images: delete old, insert new
      if (postId) {
        await (supabase as any).from("journal_post_images").delete().eq("post_id", postId);
        const imagesToInsert = postImages
          .filter((img) => img.image_url)
          .map((img, i) => ({ post_id: postId, image_url: img.image_url, caption: img.caption || null, display_order: i }));
        if (imagesToInsert.length > 0) {
          const { error: imgErr } = await (supabase as any).from("journal_post_images").insert(imagesToInsert);
          if (imgErr) throw imgErr;
        }
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["journal-posts"] }); setEditing(null); resetForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("journal_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["journal-posts"] }),
  });

  const resetForm = () => {
    setForm({ title: "", slug: "", excerpt: "", body: "", category: "", cover_image_url: "", published: false, meta_title: "", meta_description: "", template: "classic" });
    setPostImages([]);
  };

  const startEdit = async (p: any) => {
    setEditing(p.id);
    setForm({
      title: p.title || "", slug: p.slug || "", excerpt: p.excerpt || "", body: p.body || "",
      category: p.category || "", cover_image_url: p.cover_image_url || "", published: p.published,
      meta_title: p.meta_title || "", meta_description: p.meta_description || "", template: p.template || "classic",
    });
    // Load existing images
    const { data: imgs } = await (supabase as any).from("journal_post_images").select("*").eq("post_id", p.id).order("display_order");
    setPostImages((imgs || []).map((img: any) => ({ id: img.id, image_url: img.image_url, caption: img.caption || "" })));
  };

  const addImage = () => {
    if (postImages.length >= 5) return;
    setPostImages([...postImages, { image_url: "", caption: "" }]);
  };

  const removeImage = (idx: number) => {
    setPostImages(postImages.filter((_, i) => i !== idx));
  };

  const updateImage = (idx: number, field: "image_url" | "caption", value: string) => {
    const updated = [...postImages];
    updated[idx] = { ...updated[idx], [field]: value };
    setPostImages(updated);
  };

  return (
    <div>
      <div className="border border-border rounded-sm p-6 mb-8">
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">{editing ? "Edit Post" : "New Post"}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <CmsTextField label="Title *" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <CmsTextField label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <CmsTextField label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
          <div>
            <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Template</label>
            <div className="flex gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm({ ...form, template: t.value })}
                  className={`flex-1 border rounded-sm px-3 py-2 text-xs transition-colors ${
                    form.template === t.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <span className="font-medium block">{t.label}</span>
                  <span className="text-[10px] opacity-70">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <CmsImageUpload label="Cover Image" folder="journal" value={form.cover_image_url} onChange={(url) => setForm({ ...form, cover_image_url: url })} />
        </div>

        {/* Additional images (up to 5) */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs tracking-widest uppercase text-muted-foreground">Additional Images ({postImages.length}/5)</label>
            {postImages.length < 5 && (
              <button type="button" onClick={addImage} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Image
              </button>
            )}
          </div>
          {postImages.map((img, idx) => (
            <div key={idx} className="border border-border rounded-sm p-3 mb-2">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <CmsImageUpload label={`Image ${idx + 1}`} folder="journal" value={img.image_url} onChange={(url) => updateImage(idx, "image_url", url)} />
                  <div className="mt-2">
                    <CmsTextField label="Caption" value={img.caption} onChange={(v) => updateImage(idx, "caption", v)} />
                  </div>
                </div>
                <button type="button" onClick={() => removeImage(idx)} className="text-muted-foreground hover:text-destructive mt-5">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <CmsTextField label="Excerpt" value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} multiline />
        </div>
        <div className="mb-4">
          <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Body</label>
          <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={8} className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <CmsTextField label="Meta Title" value={form.meta_title} onChange={(v) => setForm({ ...form, meta_title: v })} />
          <CmsTextField label="Meta Description" value={form.meta_description} onChange={(v) => setForm({ ...form, meta_description: v })} />
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer mb-4">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          Published
        </label>
        <div className="flex gap-2">
          <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.title} className="bg-primary text-primary-foreground px-5 py-2 text-xs tracking-[0.15em] uppercase rounded-sm hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5" /> {saveMutation.isPending ? "Saving..." : editing ? "Update" : "Create"}
          </button>
          {editing && <button onClick={() => { setEditing(null); resetForm(); }} className="border border-border px-5 py-2 text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-muted">Cancel</button>}
        </div>
        {saveMutation.isError && <p className="text-destructive text-xs mt-2">{(saveMutation.error as Error).message}</p>}
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : (
        <div className="space-y-3">
          {posts?.map((p: any) => (
            <div key={p.id} className="border border-border rounded-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {p.cover_image_url && <img src={p.cover_image_url} alt="" className="h-12 w-12 rounded-sm object-cover border border-border" />}
                <div>
                  <p className="text-sm font-medium text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.category} · {p.published ? "Published" : "Draft"} · {p.template || "classic"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="text-foreground hover:text-primary"><Edit className="w-4 h-4" /></button>
                <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(p.id); }} className="text-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {posts?.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No journal posts yet.</p>}
        </div>
      )}
    </div>
  );
}

// ─── Our Story Tab ────────────────────────────────────────────
function OurStoryTab() {
  const queryClient = useQueryClient();
  const { data: sections, isLoading } = useOurStorySections();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("our_story_sections").update(form).eq("section_key", editing!);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["our-story-sections"] }); setEditing(null); },
  });

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  const textFields = ["title", "subtitle", "button_text", "button_link"];
  const multilineFields = ["description", "quote"];
  const imageFields = [
    { key: "image_url", label: "Image 1" },
    { key: "image_url_2", label: "Image 2" },
  ];

  const startEdit = (s: any) => {
    setEditing(s.section_key);
    const f: Record<string, string> = {};
    [...textFields, ...multilineFields, "image_url", "image_url_2"].forEach((field) => (f[field] = s[field] || ""));
    setForm(f);
  };

  const sectionLabels: Record<string, string> = {
    hero: "Hero Banner", tagline: "Tagline Section", "brand-story": "Brand Story",
    philosophy: "Philosophy / Quote", "founders-intro": "Founders Intro", "founder-1": "Founder Profile",
    "card-1": "Bottom Card 1 (Shop)", "card-2": "Bottom Card 2 (Gifts)", "card-3": "Bottom Card 3 (Journal)",
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground mb-4">Manage all sections of the Our Story page. You can now upload images directly.</p>
      {sections?.map((s: any) => (
        <div key={s.id} className="border border-border rounded-sm p-4">
          {editing === s.section_key ? (
            <div className="space-y-3">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                Editing: {sectionLabels[s.section_key] || s.section_key}
              </p>
              {textFields.map((field) => (
                <CmsTextField key={field} label={field.replace(/_/g, " ")} value={form[field] || ""} onChange={(v) => setForm({ ...form, [field]: v })} />
              ))}
              {multilineFields.map((field) => (
                <CmsTextField key={field} label={field.replace(/_/g, " ")} value={form[field] || ""} onChange={(v) => setForm({ ...form, [field]: v })} multiline />
              ))}
              {imageFields.map((img) => (
                <CmsImageUpload key={img.key} label={img.label} folder={`our-story/${s.section_key}`} value={form[img.key] || ""} onChange={(url) => setForm({ ...form, [img.key]: url })} />
              ))}
              <div className="flex gap-2">
                <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-primary text-primary-foreground px-5 py-2 text-xs tracking-[0.15em] uppercase rounded-sm hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1.5">
                  <Save className="w-3.5 h-3.5" /> {saveMutation.isPending ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setEditing(null)} className="border border-border px-5 py-2 text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-muted">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {s.image_url && <img src={s.image_url} alt="" className="h-12 w-12 rounded-sm object-cover border border-border" />}
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">{sectionLabels[s.section_key] || s.section_key}</p>
                  <p className="text-sm font-medium text-foreground">{s.title || "(no title)"}</p>
                  {s.description && <p className="text-xs text-muted-foreground truncate max-w-md">{s.description}</p>}
                </div>
              </div>
              <button onClick={() => startEdit(s)} className="text-foreground hover:text-primary"><Edit className="w-4 h-4" /></button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Subscribers Tab ──────────────────────────────────────────
function SubscribersTab() {
  const { data: subscribers, isLoading } = useQuery({
    queryKey: ["newsletter-subscribers"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("newsletter_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });
      if (error) throw error;
      return data as Array<{ id: string; email: string; source: string; subscribed_at: string }>;
    },
  });

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div>
      <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
        {subscribers?.length || 0} subscribers
      </p>
      <div className="border border-border rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="text-left px-4 py-2 text-xs tracking-widest uppercase text-muted-foreground">Email</th>
              <th className="text-left px-4 py-2 text-xs tracking-widest uppercase text-muted-foreground">Source</th>
              <th className="text-left px-4 py-2 text-xs tracking-widest uppercase text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {subscribers?.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className="px-4 py-2.5 text-foreground">{s.email}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{s.source}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{new Date(s.subscribed_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
