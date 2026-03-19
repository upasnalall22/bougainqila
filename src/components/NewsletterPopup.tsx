import { useState, useEffect } from "react";
import { X } from "lucide-react";
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
        await supabase.from("newsletter_subscribers" as any).insert({ email, source: "popup" } as any);
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
      <div className="bg-background rounded-sm shadow-lg max-w-md w-full p-8 relative">
        <button
          onClick={close}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2
            className="text-2xl font-light text-foreground mb-2 italic"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Before you go
          </h2>
          <p className="text-xs text-muted-foreground tracking-wide mb-6">
            New pieces, stories from the terrace and the occasional quiet thought. We will only write when we have something worth saying.
          </p>

          {submitted ? (
            <p className="text-sm text-primary">Welcome. You will hear from us soon.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary rounded-sm"
              />
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2.5 text-xs tracking-[0.15em] uppercase hover:opacity-90 transition-opacity rounded-sm"
              >
                Join
              </button>
            </form>
          )}

          <p className="text-[10px] text-muted-foreground mt-4">
            By subscribing, you agree to our Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;
