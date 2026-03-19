import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
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
              <li><Link to="/shop" className="opacity-70 hover:opacity-100 transition-opacity">Shop All</Link></li>
              <li><Link to="/our-story" className="opacity-70 hover:opacity-100 transition-opacity">About Us</Link></li>
              <li><Link to="/journal" className="opacity-70 hover:opacity-100 transition-opacity">Journal</Link></li>
              <li><Link to="/connect" className="opacity-70 hover:opacity-100 transition-opacity">Contact</Link></li>
              <li><Link to="/refund-policy" className="opacity-70 hover:opacity-100 transition-opacity">Refund Policy</Link></li>
              <li><Link to="/terms" className="opacity-70 hover:opacity-100 transition-opacity">Terms & Conditions</Link></li>
              <li><Link to="/cookie-policy" className="opacity-70 hover:opacity-100 transition-opacity">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-4 opacity-70">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:kavanika@gmail.com" className="opacity-70 hover:opacity-100 transition-opacity inline-flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  kavanika@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919810374919" className="opacity-70 hover:opacity-100 transition-opacity inline-flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +91 98103 74919
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-4 opacity-70">Follow Us</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://pinterest.com/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity" aria-label="Pinterest">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="17" x2="12" y2="22" />
                  <path d="M5 12V9a7 7 0 0 1 14 0v3" />
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                </svg>
              </a>
              <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
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
