const AboutSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Image placeholder */}
        <div className="aspect-[4/5] bg-card rounded-sm border border-border flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Your Story Image</span>
        </div>

        {/* Text */}
        <div className="max-w-lg">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Our Story</p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Made by Hand,<br />Made with Heart
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Every piece in our collection is shaped by hand from natural clay — no molds, no mass production. 
            Each windchime, letter, container, and hair accessory carries the subtle imperfections 
            that make handmade art truly special.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            We believe your home should tell a story. Our one-of-a-kind pieces bring warmth, 
            character, and a touch of artisan craft to your everyday spaces.
          </p>
          <span className="text-xs tracking-widest uppercase text-primary cursor-pointer hover:underline">
            Learn More About Us →
          </span>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
