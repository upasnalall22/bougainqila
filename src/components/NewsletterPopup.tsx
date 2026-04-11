import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const NewsletterPopup = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("newsletter_popup_dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setOpen(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    setOpen(false);
    sessionStorage.setItem("newsletter_popup_dismissed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        await supabase.from("newsletter_subscribers").insert({ email, source: "popup" });
      } catch {
        // non-blocking
      }
      setSubmitted(true);
      setTimeout(close, 2000);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-4">
      <div className="bg-background rounded-lg shadow-lg max-w-sm w-full p-8 relative">
        <button
          onClick={close}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-primary mb-2">Join the</p>
          <h2
            className="text-2xl font-light text-foreground mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Qila Tribe
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Be the first to know about new products, secret drops and maker stories.
          </p>

          {submitted ? (
            <p className="text-sm text-primary">Welcome to the tribe! You'll hear from us soon.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary rounded-full"
              />
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 text-sm tracking-wide rounded-full hover:opacity-90 transition-opacity font-medium"
              >
                Let the Clay shape
              </button>
            </form>
          )}

          <p className="text-[11px] text-muted-foreground mt-4">Just a story. When the light is right.</p>
          <p className="text-[10px] text-muted-foreground/60 mt-2">
            By subscribing, you agree to our{" "}
            <Link to="/terms" onClick={close} className="underline hover:text-foreground transition-colors">
              Terms & Conditions
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;
