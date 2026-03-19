import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useJournalPost } from "@/hooks/useCMS";

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
        {post.cover_image_url && (
          <img src={post.cover_image_url} alt={post.title} className="w-full aspect-[21/9] object-cover rounded-sm mb-8" />
        )}
        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
          {post.category}{post.published_at && ` · ${new Date(post.published_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`}
        </p>
        <h1 className="text-3xl md:text-4xl font-light text-foreground mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {post.title}
        </h1>
        <div className="prose prose-neutral max-w-none text-foreground">
          {post.body?.split("\n").map((p, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed mb-4">{p}</p>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JournalPost;
