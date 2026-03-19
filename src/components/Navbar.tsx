import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-semibold tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Artisan Clay
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm tracking-widest uppercase text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Shop</Link>
          <Link to="/" className="hover:text-foreground transition-colors">About</Link>
          <Link to="/" className="hover:text-foreground transition-colors">Contact</Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button className="text-foreground hover:text-primary transition-colors" aria-label="Account">
            <User className="w-5 h-5" />
          </button>
          <button className="text-foreground hover:text-primary transition-colors relative" aria-label="Cart">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border px-6 py-4 flex flex-col gap-4 text-sm tracking-widest uppercase text-muted-foreground bg-background">
          <Link to="/" className="hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>Shop</Link>
          <Link to="/" className="hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>About</Link>
          <Link to="/" className="hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>Contact</Link>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
