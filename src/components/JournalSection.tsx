import { Link } from "react-router-dom";
import { useJournalPosts, useHomepageContent } from "@/hooks/useCMS";

const JournalSection = () => {
  const { data: posts } = useJournalPosts();
  const { data: content } = useHomepageContent("journal");

  const title = content?.title || "From the Terrace";
  const subtitle = content?.description || "Journal";

  // Show latest 3 published posts
  const latestPosts = posts?.slice(0, 3) ?? [];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">{subtitle}</p>
        <h2
          className="text-3xl md:text-4xl font-light text-foreground"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {title}
        </h2>
      </div>

      {latestPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPosts.map((post: any) => (
            <Link key={post.id} to={`/journal/${post.slug}`} className="group block">
              <div className="aspect-[4/3] bg-muted rounded-sm overflow-hidden mb-3">
                {post.cover_image_url ? (
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    No Image
                  </div>
                )}
              </div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">
                {post.category}
                {post.published_at &&
                  ` · ${new Date(post.published_at).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                  })}`}
              </p>
              <h3
                className="text-base font-light text-foreground group-hover:text-primary transition-colors"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-sm">
          No journal posts yet. Check back soon!
        </p>
      )}

      {latestPosts.length > 0 && (
        <div className="text-center mt-10">
          <Link
            to="/journal"
            className="text-xs tracking-widest uppercase text-primary hover:underline"
          >
            Read All Stories →
          </Link>
        </div>
      )}
    </section>
  );
};

export default JournalSection;
