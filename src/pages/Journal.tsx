import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const articles = [
  {
    title: "The Art of Clay: A Journey into Handmade Windchimes",
    excerpt: "Discover how our artisans craft each windchime by hand, blending tradition with contemporary design.",
    date: "March 15, 2026",
    category: "Behind the Scenes",
  },
  {
    title: "5 Ways to Style Your Home with Clay Lettering",
    excerpt: "From entryways to living rooms, explore creative ways to incorporate personalised clay lettering into your decor.",
    date: "March 8, 2026",
    category: "Styling Tips",
  },
  {
    title: "Sustainable Crafting: Our Commitment to the Earth",
    excerpt: "Learn about the eco-friendly materials and practices that go into every BougenQila product.",
    date: "February 28, 2026",
    category: "Sustainability",
  },
  {
    title: "Gift Guide: Thoughtful Handmade Gifts for Every Occasion",
    excerpt: "Curated picks from our collection that make meaningful, one-of-a-kind gifts.",
    date: "February 20, 2026",
    category: "Gift Guide",
  },
];

const Journal = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full">
      <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Stories & Inspiration</p>
      <h1 className="text-3xl md:text-4xl font-light text-foreground mb-12" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Journal
      </h1>

      <div className="space-y-12">
        {articles.map((article, i) => (
          <article key={i} className="border-b border-border pb-10 last:border-b-0">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
              {article.category} · {article.date}
            </p>
            <h2
              className="text-xl md:text-2xl font-light text-foreground mb-3 hover:text-primary transition-colors cursor-pointer"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {article.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{article.excerpt}</p>
          </article>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default Journal;
