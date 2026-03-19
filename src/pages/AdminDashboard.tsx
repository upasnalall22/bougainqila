import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAllHomepageContent, useAllCategoryContent, useJournalPosts } from "@/hooks/useCMS";
import { useOurStorySections } from "@/hooks/useOurStory";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
          {(["homepage", "categories", "journal", "our-story"] as Tab[]).map((t) => (
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
      </main>
      <Footer />
    </div>
  );
};

// ─── Homepage Tab ─────────────────────────────────────────────
function HomepageTab() {
  const queryClient = useQueryClient();
  const { data: sections, isLoading } = useAllHomepageContent();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("homepage_content")
        .update(form)
        .eq("section", editing!);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homepage-content"] });
      setEditing(null);
    },
  });

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  const startEdit = (s: any) => {
    setEditing(s.section);
    setForm({
      title: s.title || "",
      subtitle: s.subtitle || "",
      description: s.description || "",
      button_text: s.button_text || "",
      button_link: s.button_link || "",
      image_url: s.image_url || "",
      meta_title: s.meta_title || "",
      meta_description: s.meta_description || "",
    });
  };

  return (
    <div className="space-y-4">
      {sections?.map((s: any) => (
        <div key={s.id} className="border border-border rounded-sm p-4">
          {editing === s.section ? (
            <div className="space-y-3">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Editing: {s.section}</p>
              {["title", "subtitle", "description", "button_text", "button_link", "image_url", "meta_title", "meta_description"].map((field) => (
                <div key={field}>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">{field.replace(/_/g, " ")}</label>
                  {field === "description" || field === "meta_description" ? (
                    <textarea
                      value={form[field] || ""}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      rows={3}
                      className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={form[field] || ""}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  )}
                </div>
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
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">{s.section}</p>
                <p className="text-sm font-medium text-foreground">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.subtitle}</p>
              </div>
              <button onClick={() => startEdit(s)} className="text-foreground hover:text-primary">
                <Edit className="w-4 h-4" />
              </button>
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
      const { error } = await supabase
        .from("category_content")
        .update(form)
        .eq("slug", editing!);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-category-content"] });
      setEditing(null);
    },
  });

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  const startEdit = (c: any) => {
    setEditing(c.slug);
    setForm({
      name: c.name || "",
      description: c.description || "",
      banner_image_url: c.banner_image_url || "",
      meta_title: c.meta_title || "",
      meta_description: c.meta_description || "",
    });
  };

  return (
    <div className="space-y-4">
      {categories?.map((c: any) => (
        <div key={c.id} className="border border-border rounded-sm p-4">
          {editing === c.slug ? (
            <div className="space-y-3">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Editing: {c.slug}</p>
              {["name", "description", "banner_image_url", "meta_title", "meta_description"].map((field) => (
                <div key={field}>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">{field.replace(/_/g, " ")}</label>
                  {field === "description" || field === "meta_description" ? (
                    <textarea
                      value={form[field] || ""}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      rows={3}
                      className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={form[field] || ""}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  )}
                </div>
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
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">{c.slug}</p>
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground truncate max-w-md">{c.description}</p>
              </div>
              <button onClick={() => startEdit(c)} className="text-foreground hover:text-primary">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Journal Tab ──────────────────────────────────────────────
function JournalTab() {
  const queryClient = useQueryClient();
  const { data: posts, isLoading } = useJournalPosts(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    category: "",
    cover_image_url: "",
    published: false,
    meta_title: "",
    meta_description: "",
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const payload = {
        ...form,
        slug,
        published_at: form.published ? new Date().toISOString() : null,
      };

      if (editing) {
        const { error } = await supabase.from("journal_posts").update(payload).eq("id", editing);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("journal_posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal-posts"] });
      setEditing(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("journal_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["journal-posts"] }),
  });

  const resetForm = () => setForm({ title: "", slug: "", excerpt: "", body: "", category: "", cover_image_url: "", published: false, meta_title: "", meta_description: "" });

  const startEdit = (p: any) => {
    setEditing(p.id);
    setForm({
      title: p.title || "",
      slug: p.slug || "",
      excerpt: p.excerpt || "",
      body: p.body || "",
      category: p.category || "",
      cover_image_url: p.cover_image_url || "",
      published: p.published,
      meta_title: p.meta_title || "",
      meta_description: p.meta_description || "",
    });
  };

  return (
    <div>
      {/* Form */}
      <div className="border border-border rounded-sm p-6 mb-8">
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">{editing ? "Edit Post" : "New Post"}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Category</label>
            <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Cover Image URL</label>
            <input type="text" value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>
        <div className="mb-4">
          <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Excerpt</label>
          <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
        </div>
        <div className="mb-4">
          <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Body</label>
          <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={8} className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Meta Title</label>
            <input type="text" value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Meta Description</label>
            <input type="text" value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
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

      {/* List */}
      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : (
        <div className="space-y-3">
          {posts?.map((p: any) => (
            <div key={p.id} className="border border-border rounded-sm p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.category} · {p.published ? "Published" : "Draft"}</p>
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
      const { error } = await supabase
        .from("our_story_sections")
        .update(form)
        .eq("section_key", editing!);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["our-story-sections"] });
      setEditing(null);
    },
  });

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  const fields = ["title", "subtitle", "description", "quote", "image_url", "image_url_2", "button_text", "button_link"];

  const startEdit = (s: any) => {
    setEditing(s.section_key);
    const f: Record<string, string> = {};
    fields.forEach((field) => (f[field] = s[field] || ""));
    setForm(f);
  };

  const sectionLabels: Record<string, string> = {
    hero: "Hero Banner",
    tagline: "Tagline Section",
    "brand-story": "Brand Story",
    philosophy: "Philosophy / Quote",
    "founders-intro": "Founders Intro",
    "founder-1": "Founder Profile",
    "card-1": "Bottom Card 1 (Shop)",
    "card-2": "Bottom Card 2 (Gifts)",
    "card-3": "Bottom Card 3 (Journal)",
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground mb-4">Manage all sections of the Our Story page. Upload images via product image storage and paste URLs here.</p>
      {sections?.map((s: any) => (
        <div key={s.id} className="border border-border rounded-sm p-4">
          {editing === s.section_key ? (
            <div className="space-y-3">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                Editing: {sectionLabels[s.section_key] || s.section_key}
              </p>
              {fields.map((field) => (
                <div key={field}>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">
                    {field.replace(/_/g, " ")}
                  </label>
                  {field === "description" || field === "quote" ? (
                    <textarea
                      value={form[field] || ""}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      rows={3}
                      className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={form[field] || ""}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-2">
                <button
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  className="bg-primary text-primary-foreground px-5 py-2 text-xs tracking-[0.15em] uppercase rounded-sm hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> {saveMutation.isPending ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="border border-border px-5 py-2 text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                  {sectionLabels[s.section_key] || s.section_key}
                </p>
                <p className="text-sm font-medium text-foreground">{s.title || "(no title)"}</p>
                {s.description && <p className="text-xs text-muted-foreground truncate max-w-md">{s.description}</p>}
              </div>
              <button onClick={() => startEdit(s)} className="text-foreground hover:text-primary">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
