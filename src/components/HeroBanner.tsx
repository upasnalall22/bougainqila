import { Link } from "react-router-dom";

const HeroBanner = () => {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] bg-muted overflow-hidden flex items-center justify-center">
      {/* Placeholder background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-muted to-card" />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C4896B' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative z-10 text-center px-6 max-w-2xl">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">Handcrafted with Love</p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight text-foreground mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          One of a Kind<br />Clay Creations
        </h1>
        <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-md mx-auto">
          Unique handmade home decor & accessories, crafted piece by piece with intention.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 text-sm tracking-widest uppercase hover:opacity-90 transition-opacity rounded-sm"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
};

export default HeroBanner;
