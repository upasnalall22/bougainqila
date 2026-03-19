import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Connect = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await supabase.functions.invoke("send-order-notification", {
        body: { type: "query", ...form },
      });
    } catch {
      // non-blocking
    }
    toast.success("Thank you. We will write back soon.");
    setSubmitted(true);
    setSending(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-6 py-20 w-full">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Say Hello</p>
        <h1 className="text-3xl md:text-4xl font-light text-foreground mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          We would love to hear from you
        </h1>

        {submitted ? (
          <div className="bg-card border border-border rounded-sm p-8 text-center">
            <p className="text-foreground text-lg mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Thank you!</p>
            <p className="text-muted-foreground text-sm">Thank you. We will write back soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-2">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-2">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-2">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground rounded-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="bg-primary text-primary-foreground px-8 py-3 text-xs tracking-widest uppercase hover:opacity-90 transition-opacity rounded-sm disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Connect;
