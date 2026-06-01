import { Link } from "react-router-dom";
import { useJournalPosts, useHomepageContent } from "@/hooks/useCMS";

const JournalSection = () => {
  const { data: posts } = useJournalPosts(true);
  const { data: content } = useHomepageContent("journal");

  const title = content?.title || "From the Terrace";
  const subtitle = content?.description || "Journal";

  const feedPosts = posts?.slice(0, 5) ?? [];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">{subtitle}</p>
        <h2
          className="text-3xl md:text-4xl font-light text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {title}
        </h2>
      </div>

      {feedPosts.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {feedPosts.map((post: any) => (
            <Link
              key={post.id}
              to={`/journal/${post.slug}`}
              className="group relative flex-shrink-0 w-40 sm:w-48 md:w-56 aspect-square overflow-hidden rounded-sm bg-muted block"
            >
              {post.cover_image_url ? (
                <img
                  src={post.cover_image_url}
                  alt={post.title || ""}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <span className="text-xs text-muted-foreground">No image</span>
                </div>
              )}
              {/* Constant bottom gradient + always-visible title for legibility */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-foreground/85 via-foreground/40 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-center">
                <p className="text-[11px] sm:text-xs text-background leading-tight line-clamp-2 font-medium tracking-wide [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]">
                  {post.title}
                </p>
              </div>

            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-sm">
          No stories yet. Check back soon!
        </p>
      )}

      {feedPosts.length > 0 && (
        <div className="text-center mt-10">
          <Link
            to="/journal"
            className="text-xs tracking-widest uppercase text-primary hover:underline"
          >
            View All Stories →
          </Link>
        </div>
      )}
    </section>
  );
};

export default JournalSection;
