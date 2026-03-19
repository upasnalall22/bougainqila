import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useJournalPost } from "@/hooks/useCMS";

type PostImage = { id: string; image_url: string; caption: string | null; display_order: number };

// ─── Classic Template ─────────────────────────────────────────
function ClassicLayout({ post, images }: { post: any; images: PostImage[] }) {
  return (
    <>
      {post.cover_image_url && (
        <img src={post.cover_image_url} alt={post.title} className="w-full aspect-[21/9] object-cover rounded-sm mb-8" />
      )}
      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
        {post.category}{post.published_at && ` · ${new Date(post.published_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`}
      </p>
      <h1 className="text-3xl md:text-4xl font-light text-foreground mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {post.title}
      </h1>
      <div className="prose prose-neutral max-w-none text-foreground mb-10">
        {post.body?.split("\n").map((p: string, i: number) => (
          <p key={i} className="text-muted-foreground leading-relaxed mb-4">{p}</p>
        ))}
      </div>
      {images.length > 0 && (
        <div className="space-y-4">
          {images.map((img) => (
            <figure key={img.id}>
              <img src={img.image_url} alt={img.caption || ""} className="w-full rounded-sm object-cover" />
              {img.caption && <figcaption className="text-xs text-muted-foreground mt-2 text-center italic">{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Gallery Template ─────────────────────────────────────────
function GalleryLayout({ post, images }: { post: any; images: PostImage[] }) {
  return (
    <>
      {post.cover_image_url && (
        <img src={post.cover_image_url} alt={post.title} className="w-full aspect-[16/9] object-cover rounded-sm mb-8" />
      )}
      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
        {post.category}{post.published_at && ` · ${new Date(post.published_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`}
      </p>
      <h1 className="text-3xl md:text-4xl font-light text-foreground mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {post.title}
      </h1>
      <div className="prose prose-neutral max-w-none text-foreground mb-10">
        {post.body?.split("\n").map((p: string, i: number) => (
          <p key={i} className="text-muted-foreground leading-relaxed mb-4">{p}</p>
        ))}
      </div>
      {images.length > 0 && (
        <div className={`grid gap-3 ${images.length === 1 ? "grid-cols-1" : images.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"}`}>
          {images.map((img) => (
            <figure key={img.id} className="group">
              <div className="aspect-square overflow-hidden rounded-sm">
                <img src={img.image_url} alt={img.caption || ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              {img.caption && <figcaption className="text-xs text-muted-foreground mt-1.5 text-center">{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Editorial Template ───────────────────────────────────────
function EditorialLayout({ post, images }: { post: any; images: PostImage[] }) {
  const paragraphs = post.body?.split("\n").filter((p: string) => p.trim()) || [];

  return (
    <>
      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
        {post.category}{post.published_at && ` · ${new Date(post.published_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`}
      </p>
      <h1 className="text-3xl md:text-5xl font-light text-foreground mb-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {post.title}
      </h1>

      {/* Cover image full bleed */}
      {post.cover_image_url && (
        <img src={post.cover_image_url} alt={post.title} className="w-full aspect-[21/9] object-cover rounded-sm mb-10" />
      )}

      {/* Interleave text and images */}
      {paragraphs.map((text: string, i: number) => {
        const img = images[i];
        const isEven = i % 2 === 0;
        return (
          <div key={i} className={`mb-10 ${img ? `md:flex md:gap-8 ${isEven ? "" : "md:flex-row-reverse"}` : ""}`}>
            {img && (
              <figure className="md:w-1/2 mb-4 md:mb-0 shrink-0">
                <img src={img.image_url} alt={img.caption || ""} className="w-full rounded-sm object-cover aspect-[4/3]" />
                {img.caption && <figcaption className="text-xs text-muted-foreground mt-1.5 italic">{img.caption}</figcaption>}
              </figure>
            )}
            <p className={`text-muted-foreground leading-relaxed ${img ? "md:w-1/2 self-center" : ""}`}>{text}</p>
          </div>
        );
      })}

      {/* Remaining images not paired with paragraphs */}
      {images.slice(paragraphs.length).map((img) => (
        <figure key={img.id} className="mb-6">
          <img src={img.image_url} alt={img.caption || ""} className="w-full rounded-sm object-cover" />
          {img.caption && <figcaption className="text-xs text-muted-foreground mt-1.5 text-center italic">{img.caption}</figcaption>}
        </figure>
      ))}
    </>
  );
}

const JournalPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useJournalPost(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-muted-foreground">Article not found.</p>
          <Link to="/journal" className="text-primary text-sm hover:underline">← Back to Journal</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const images: PostImage[] = (post as any).images || [];
  const template = (post as any).template || "classic";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.meta_description,
    datePublished: post.published_at,
    image: post.cover_image_url,
    author: { "@type": "Organization", name: "BougenQila" },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || ""}
        canonical={`${window.location.origin}/journal/${post.slug}`}
        ogImage={post.cover_image_url || undefined}
        type="article"
        jsonLd={jsonLd}
      />
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-20 w-full">
        <Link to="/journal" className="text-xs tracking-widest uppercase text-muted-foreground hover:text-primary mb-8 inline-block">
          ← Back to Journal
        </Link>
        {template === "gallery" && <GalleryLayout post={post} images={images} />}
        {template === "editorial" && <EditorialLayout post={post} images={images} />}
        {(template === "classic" || !template) && <ClassicLayout post={post} images={images} />}
      </main>
      <Footer />
    </div>
  );
};

export default JournalPost;
