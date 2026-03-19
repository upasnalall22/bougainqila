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
        description="Read stories, styling tips, and behind-the-scenes insights from BougenQila's handcrafted clay studio."
        canonical={`${window.location.origin}/journal`}
      />
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Stories & Inspiration</p>
        <h1 className="text-3xl md:text-4xl font-light text-foreground mb-12" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Journal
        </h1>

        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-12">
            {posts.map((article: any) => (
              <article key={article.id} className="border-b border-border pb-10 last:border-b-0">
                {article.cover_image_url && (
                  <img src={article.cover_image_url} alt={article.title} className="w-full aspect-[21/9] object-cover rounded-sm mb-4" loading="lazy" />
                )}
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
                  {article.category}{article.published_at && ` · ${new Date(article.published_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`}
                </p>
                <Link to={`/journal/${article.slug}`}>
                  <h2
                    className="text-xl md:text-2xl font-light text-foreground mb-3 hover:text-primary transition-colors cursor-pointer"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {article.title}
                  </h2>
                </Link>
                <p className="text-sm text-muted-foreground leading-relaxed">{article.excerpt}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No articles yet. Check back soon!</p>
        )}
      </main>
      <NewsletterBar />
      <Footer />
    </div>
  );
};

export default Journal;
