import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              BougenQila
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">
              Handcrafted clay home decor & accessories. Every piece is one of a kind.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-4 opacity-70">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="opacity-70 hover:opacity-100 transition-opacity">Shop All</Link></li>
              <li><Link to="/" className="opacity-70 hover:opacity-100 transition-opacity">About Us</Link></li>
              <li><Link to="/" className="opacity-70 hover:opacity-100 transition-opacity">Contact</Link></li>
              <li><Link to="/" className="opacity-70 hover:opacity-100 transition-opacity">Shipping & Returns</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-4 opacity-70">Stay Connected</h4>
            <p className="text-sm opacity-70 mb-4">Follow us for new drops and behind-the-scenes.</p>
            <div className="flex gap-4 text-sm">
              <a href="#" className="opacity-70 hover:opacity-100 transition-opacity">Instagram</a>
              <a href="#" className="opacity-70 hover:opacity-100 transition-opacity">Facebook</a>
              <a href="#" className="opacity-70 hover:opacity-100 transition-opacity">Pinterest</a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-6 text-center text-xs opacity-50">
          © {new Date().getFullYear()} BougenQila. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
