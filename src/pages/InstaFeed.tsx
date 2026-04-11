import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Instagram } from "lucide-react";
import journal1 from "@/assets/journal-1.jpg";
import journal2 from "@/assets/journal-2.jpg";
import journal3 from "@/assets/journal-3.jpg";
import journal4 from "@/assets/journal-4.jpg";
import journal5 from "@/assets/journal-5.jpg";
import journal6 from "@/assets/journal-6.jpg";

const posts = [
  { image: journal1, link: "https://instagram.com/", caption: "Our clay collection" },
  { image: journal2, link: "https://instagram.com/", caption: "Behind the scenes" },
  { image: journal3, link: "https://instagram.com/", caption: "New arrivals" },
  { image: journal4, link: "https://instagram.com/", caption: "Clay lettering" },
  { image: journal5, link: "https://instagram.com/", caption: "Hair accessories" },
  { image: journal6, link: "https://instagram.com/", caption: "Mini planters" },
];

const InstaFeed = () => (
  <div className="min-h-screen flex flex-col">
    <SEOHead title="InstaFeed | BougainQila" description="Follow BougainQila on Instagram — handcrafted clay home decor inspiration." canonical="/insta-feed" />
    <Navbar />
    <main className="flex-1">
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Instagram</p>
          <h1 className="text-3xl md:text-4xl font-light text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            Follow Our Story
          </h1>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Instagram className="w-4 h-4" />
            @bougainqila
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post, i) => (
            <a
              key={i}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-sm"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center">
                <Instagram className="w-6 h-6 text-background opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="absolute bottom-0 left-0 right-0 px-3 py-2 text-xs text-background/90 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity">
                {post.caption}
              </p>
            </a>
          ))}
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default InstaFeed;
