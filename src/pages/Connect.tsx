import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterBar from "@/components/NewsletterBar";
import SEOHead from "@/components/SEOHead";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CustomerFormFields, {
  type CustomerFormData,
  type CustomerFormErrors,
  emptyCustomerForm,
  validateCustomerForm,
} from "@/components/CustomerFormFields";

const Connect = () => {
  const [customerForm, setCustomerForm] = useState<CustomerFormData>(emptyCustomerForm);
  const [customerErrors, setCustomerErrors] = useState<CustomerFormErrors>({});
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleBlurValidate = (field: keyof CustomerFormErrors) => {
    const allErrors = validateCustomerForm(customerForm);
    setCustomerErrors((prev) => ({ ...prev, [field]: allErrors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCustomerForm(customerForm);
    setCustomerErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    setSending(true);

    const fullName = [customerForm.salutation, customerForm.firstName, customerForm.lastName].filter(Boolean).join(" ");

    try {
      await supabase.functions.invoke("send-order-notification", {
        body: {
          type: "query",
          name: fullName,
          email: customerForm.email,
          phone: "+91" + customerForm.mobile.replace(/\s/g, ""),
          city: customerForm.city,
          message,
        },
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
      <SEOHead title="Contact Us | BougainQila" description="Get in touch with BougainQila. We'd love to hear from you — questions, custom orders and collaborations welcome." canonical="/connect" />
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-6 py-20 w-full">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Say Hello</p>
        <h1 className="text-3xl md:text-4xl font-light text-foreground mb-8" style={{ fontFamily: "var(--font-heading)" }}>
          We would love to hear from you
        </h1>

        {submitted ? (
          <div className="bg-card border border-border rounded-sm p-8 text-center">
            <p className="text-foreground text-lg mb-2" style={{ fontFamily: "var(--font-heading)" }}>Thank you!</p>
            <p className="text-muted-foreground text-sm">Thank you. We will write back soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <CustomerFormFields
              form={customerForm}
              onChange={setCustomerForm}
              errors={customerErrors}
              onBlurValidate={handleBlurValidate}
            />
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-2">Message *</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                placeholder="Tell us what's on your mind..."
                className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground rounded-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="bg-primary text-primary-foreground px-8 py-3 text-xs tracking-widest uppercase hover:opacity-90 transition-opacity rounded-sm disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </form>
        )}
      </main>
      <NewsletterBar />
      <Footer />
    </div>
  );
};

export default Connect;
