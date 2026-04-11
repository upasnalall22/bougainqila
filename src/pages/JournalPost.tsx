import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useJournalPost } from "@/hooks/useCMS";

type PostImage = {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
};

/**
 * Extracts headings (lines starting with ## or bold **...**) from the body
 * to build a Table of Contents, similar to the Philips blog style.
 */
function extractHeadings(body: string | null): { id: string; text: string }[] {
  if (!body) return [];
  const headings: { id: string; text: string }[] = [];
  body.split("\n").forEach((line) => {
    const trimmed = line.trim();
    // Match markdown-style headings ## Heading
    const mdMatch = trimmed.match(/^#{1,3}\s+(.+)/);
    if (mdMatch) {
      const text = mdMatch[1].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      headings.push({ id, text });
      return;
    }
    // Match bold lines used as section titles **Title**
    const boldMatch = trimmed.match(/^\*\*(.+)\*\*$/);
    if (boldMatch) {
      const text = boldMatch[1].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      headings.push({ id, text });
    }
  });
  return headings;
}

/**
 * Renders body text, converting ## headings and **bold** lines into
 * proper HTML headings with anchor IDs for TOC linking.
 */
function renderBody(body: string | null) {
  if (!body) return null;
  return body.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={i} className="h-4" />;

    const mdMatch = trimmed.match(/^#{1,3}\s+(.+)/);
    if (mdMatch) {
      const text = mdMatch[1].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return (
        <h2
          key={i}
          id={id}
          className="text-xl md:text-2xl font-semibold text-foreground mt-10 mb-4 scroll-mt-24"
        >
          {text}
        </h2>
      );
    }

    const boldMatch = trimmed.match(/^\*\*(.+)\*\*$/);
    if (boldMatch) {
      const text = boldMatch[1].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return (
        <h3
          key={i}
          id={id}
          className="text-lg font-semibold text-foreground mt-8 mb-3 scroll-mt-24"
        >
          {text}
        </h3>
      );
    }

    return (
      <p key={i} className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">
        {trimmed}
      </p>
    );
  });
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
          <Link to="/journal" className="text-primary text-sm hover:underline">
            ← Back to Journal
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const images: PostImage[] = (post as any).images || [];
  const headings = extractHeadings(post.body);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.meta_description,
    datePublished: post.published_at,
    image: post.cover_image_url,
    author: { "@type": "Organization", name: "BougainQila" },
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
      <main className="flex-1 w-full">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-2">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
            <Link to="/journal" className="hover:text-primary transition-colors">
              Journal
            </Link>
            <span>/</span>
            {post.category && (
              <>
                <span className="hover:text-primary transition-colors">{post.category}</span>
                <span>/</span>
              </>
            )}
            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
              {post.title}
            </span>
          </nav>
        </div>

        {/* Cover image — full-width */}
        {post.cover_image_url && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-4">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full aspect-[21/9] object-cover rounded-sm"
            />
          </div>
        )}

        {/* Article content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          {/* Table of Contents */}
          {headings.length > 0 && (
            <div className="border border-border rounded-sm p-5 mb-10 bg-muted/30">
              <h4 className="text-sm font-semibold text-foreground mb-3">Table of Contents</h4>
              <ol className="space-y-1.5">
                {headings.map((h, i) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-start gap-1.5"
                    >
                      <span className="text-muted-foreground/60 shrink-0">{i + 1}.</span>
                      <span>{h.text}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Date & Category */}
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
            {post.category}
            {post.published_at &&
              ` · ${new Date(post.published_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`}
          </p>

          {/* Title */}
          <h1
            className="text-2xl md:text-4xl font-light text-foreground mb-8"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {post.title}
          </h1>

          {/* Body */}
          <div className="mb-10">{renderBody(post.body)}</div>

          {/* Additional images */}
          {images.length > 0 && (
            <div className="space-y-6">
              {images.map((img) => (
                <figure key={img.id}>
                  <img
                    src={img.image_url}
                    alt={img.caption || ""}
                    className="w-full rounded-sm object-cover"
                    loading="lazy"
                  />
                  {img.caption && (
                    <figcaption className="text-xs text-muted-foreground mt-2 text-center italic">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-border">
            <Link
              to="/journal"
              className="text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
            >
              ← Back to Journal
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JournalPost;
