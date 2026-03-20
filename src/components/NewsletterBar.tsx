import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const NewsletterBar = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        await supabase.from("newsletter_subscribers" as any).insert({ email, source: "footer_bar" } as any);
      } catch {







        // non-blocking
      }setSubmitted(true);}};return <section className="bg-muted py-12 md:py-16">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-xl md:text-2xl font-light text-foreground mb-2 italic"
      style={{ fontFamily: "'Cormorant Garamond', serif" }}>Join the Qila Tribe


      </h2>
        <p className="text-xs text-muted-foreground tracking-wide mb-6">
          New pieces, behind-the-scenes stories and the occasional quiet thought — straight to your inbox.
        </p>

        {submitted ?
      <p className="text-sm text-primary">Welcome. You will hear from us soon.</p> :

      <form onSubmit={handleSubmit} className="flex justify-center gap-0 max-w-md mx-auto">
            <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary rounded-l-sm" />
          
            <button
          type="submit"
          className="bg-primary text-primary-foreground px-6 py-2.5 text-xs tracking-[0.15em] uppercase hover:opacity-90 transition-opacity rounded-r-sm">
            
              Join
            </button>
          </form>
      }
      </div>
    </section>;

};

export default NewsletterBar;