import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import { useInstaFeedItems, useHomepageContent } from "@/hooks/useCMS";

const JournalSection = () => {
  const { data: items } = useInstaFeedItems();
  const { data: content } = useHomepageContent("journal");

  const title = content?.title || "From the Terrace";
  const subtitle = content?.description || "Journal";

  const feedItems = items?.slice(0, 5) ?? [];

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

      {feedItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {feedItems.map((item: any) => {
            const isExternal = item.link_type === "external";
            const href = isExternal
              ? item.link_url || "#"
              : item.journal_post_id
                ? `/journal/${item.link_url || ""}`
                : "#";

            const Wrapper = isExternal ? "a" : Link;
            const wrapperProps = isExternal
              ? { href, target: "_blank", rel: "noopener noreferrer" }
              : { to: href };

            return (
              <Wrapper
                key={item.id}
                {...(wrapperProps as any)}
                className="group relative aspect-square overflow-hidden rounded-sm bg-muted block"
              >
                <img
                  src={item.image_url}
                  alt={item.caption || ""}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-2">
                    <Instagram className="w-5 h-5 text-background mx-auto mb-1.5" />
                    {item.caption && (
                      <p className="text-[10px] text-background leading-tight line-clamp-2">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              </Wrapper>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-sm">
          No stories yet. Check back soon!
        </p>
      )}

      {feedItems.length > 0 && (
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
