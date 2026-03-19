import { ShoppingBag, User, Menu, X, Search, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const subCategories = [
  { label: "Windchimes", to: "/home-living/windchimes" },
  { label: "Letterings", to: "/home-living/letterings" },
  { label: "Containers", to: "/home-living/containers" },
  { label: "Hair Accents", to: "/home-living/hair-accents" },
];

const navLinks = [
  { label: "Shop All", to: "/shop" },
  { label: "Home & Living", to: "/home-living", hasMega: true },
  { label: "The Gift Shop", to: "/gift-shop" },
  { label: "Journal", to: "/journal" },
  
  { label: "Our Story", to: "/our-story" },
  { label: "Connect", to: "/connect" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMegaEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMegaOpen(true);
  };

  const handleMegaLeave = () => {
    timeoutRef.current = setTimeout(() => setMegaOpen(false), 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="BougenQila" className="h-14 md:h-16 w-auto object-contain" />
        </Link>

        {/* Desktop Nav - Centered */}
        <nav className="hidden md:flex items-center justify-center flex-1 gap-6 text-[10px] lg:text-xs tracking-[0.15em] uppercase text-foreground/70">
          {navLinks.map((link) =>
            link.hasMega ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={handleMegaEnter}
                onMouseLeave={handleMegaLeave}
              >
                <Link
                  to={link.to}
                  className="hover:text-foreground transition-colors whitespace-nowrap inline-flex items-center gap-1"
                >
                  {link.label}
                  <ChevronDown className="w-3 h-3" />
                </Link>

                {/* Mega Menu Dropdown */}
                {megaOpen && (
                  <div
                    ref={megaRef}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-background border border-border rounded-sm shadow-lg p-6 min-w-[280px] z-50"
                  >
                    <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-4 font-medium">
                      Categories
                    </p>
                    <div className="flex flex-col gap-3">
                      {subCategories.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.to}
                          className="text-xs tracking-[0.1em] uppercase text-foreground/80 hover:text-primary transition-colors"
                          onClick={() => setMegaOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className="hover:text-foreground transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-3">
          <button className="text-foreground hover:text-primary transition-colors" aria-label="Search">
            <Search className="w-4 h-4" />
          </button>
          <button className="text-foreground hover:text-primary transition-colors" aria-label="Account">
            <User className="w-4 h-4" />
          </button>
          <button className="text-foreground hover:text-primary transition-colors relative" aria-label="Cart">
            <ShoppingBag className="w-4 h-4" />
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">0</span>
          </button>
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border px-6 py-4 flex flex-col gap-3 text-[11px] tracking-[0.2em] uppercase text-muted-foreground bg-background">
          {navLinks.map((link) =>
            link.hasMega ? (
              <div key={link.label}>
                <button
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1 w-full text-left"
                  onClick={() => setMobileSubOpen(!mobileSubOpen)}
                >
                  {link.label}
                  <ChevronDown className={`w-3 h-3 transition-transform ${mobileSubOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileSubOpen && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {subCategories.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.to}
                        className="text-xs tracking-wide text-foreground/70 hover:text-primary transition-colors normal-case"
                        onClick={() => setMobileOpen(false)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className="hover:text-foreground transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
