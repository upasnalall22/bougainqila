import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Mail, Phone } from "lucide-react";
import { useHomepageContent } from "@/hooks/useCMS";

const Footer = () => {
  const { data: footerContent } = useHomepageContent("footer");
  const { data: contactContent } = useHomepageContent("footer-contact");
  const { data: socialContent } = useHomepageContent("footer-social");

  const brandName = footerContent?.title || "BougainQila";
  const brandDesc =
    footerContent?.description ||
    "Handmade home decor shaped one piece at a time on a terrace in Gurugram. No two are the same.";
  const email = contactContent?.subtitle || "studio@bougainqila.com";
  const phone = contactContent?.description || "+91 98103 74919";
  const instagramUrl = socialContent?.subtitle || "https://instagram.com/";
  const otherSocials = (
    socialContent?.description || "https://facebook.com/|https://pinterest.com/|https://youtube.com/"
  ).split("|");

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              {brandName}
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">{brandDesc}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-4 opacity-70">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop" className="opacity-70 hover:opacity-100 transition-opacity">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/our-story" className="opacity-70 hover:opacity-100 transition-opacity">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/journal" className="opacity-70 hover:opacity-100 transition-opacity">
                  Journal
                </Link>
              </li>
              <li>
                <Link to="/connect" className="opacity-70 hover:opacity-100 transition-opacity">
                  Connect
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="opacity-70 hover:opacity-100 transition-opacity">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="opacity-70 hover:opacity-100 transition-opacity">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="opacity-70 hover:opacity-100 transition-opacity">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-4 opacity-70">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="opacity-70 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="opacity-70 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  {phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-4 opacity-70">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              {otherSocials[0] && (
                <a
                  href={otherSocials[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {otherSocials[1] && (
                <a
                  href={otherSocials[1]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                  aria-label="Pinterest"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345c-.091.379-.293 1.194-.333 1.361-.052.22-.174.266-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                  </svg>
                </a>
              )}
              {otherSocials[2] && (
                <a
                  href={otherSocials[2]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-6 text-center text-xs opacity-50">
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
