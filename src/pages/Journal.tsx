import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterBar from "@/components/NewsletterBar";
import SEOHead from "@/components/SEOHead";
import { useJournalPosts } from "@/hooks/useCMS";
import { Link } from "react-router-dom";

const Journal = () => {
  const { data: posts, isLoading } = useJournalPosts();

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Journal — Stories & Inspiration"
        description="Read stories, styling tips, and behind-the-scenes insights from BougainQila's handcrafted clay studio."
        canonical={`${window.location.origin}/journal`}
      />
      <Navbar />
      <main className="flex-1 w-full">
        {/* Breadcrumb */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-2">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Journal</span>
          </nav>
        </div>

        {/* Header */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-10">
          <h1
            className="text-3xl md:text-4xl font-light text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Stories & Inspiration
          </h1>
        </div>

        {/* Posts grid */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((article: any) => (
                <Link
                  key={article.id}
                  to={`/journal/${article.slug}`}
                  className="group block"
                >
                  <article className="flex flex-col h-full">
                    {article.cover_image_url ? (
                      <div className="aspect-[16/10] overflow-hidden rounded-sm mb-4">
                        <img
                          src={article.cover_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] bg-muted rounded-sm mb-4 flex items-center justify-center">
                        <span className="text-muted-foreground text-xs">No image</span>
                      </div>
                    )}
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
                      {article.category}
                      {article.published_at &&
                        ` · ${new Date(article.published_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}`}
                    </p>
                    <h2
                      className="text-lg font-light text-foreground mb-2 group-hover:text-primary transition-colors leading-snug"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {article.title}
                    </h2>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mt-auto">
                      {article.excerpt}
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No articles yet. Check back soon!</p>
          )}
        </div>
      </main>
      <NewsletterBar />
      <Footer />
    </div>
  );
};

export default Journal;
