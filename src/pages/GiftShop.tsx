import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterBar from "@/components/NewsletterBar";
import ProductCard from "@/components/ProductCard";
import SortDropdown, { sortProducts, type SortOption } from "@/components/SortDropdown";
import { useProducts } from "@/hooks/useProducts";
import { useHomepageContent } from "@/hooks/useCMS";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CustomerFormFields, {
  type CustomerFormData,
  type CustomerFormErrors,
  emptyCustomerForm,
  validateCustomerForm,
} from "@/components/CustomerFormFields";

const GiftShop = () => {
  const { data: products, isLoading } = useProducts("gift-set");
  const { data: set1 } = useHomepageContent("gift-set-1");
  const { data: set2 } = useHomepageContent("gift-set-2");
  const { data: set3 } = useHomepageContent("gift-set-3");
  const [sort, setSort] = useState<SortOption>("newest");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const [customerForm, setCustomerForm] = useState<CustomerFormData>(emptyCustomerForm);
  const [customerErrors, setCustomerErrors] = useState<CustomerFormErrors>({});
  const [enquiryType, setEnquiryType] = useState<"enquire" | "appointment">("enquire");
  const [serviceType, setServiceType] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [message, setMessage] = useState("");

  const sortedProducts = products ? sortProducts(products, sort) : [];

  const curatedSets = [
    { title: set1?.title || "The Housewarming Edit", description: set1?.description || "A curated collection of handcrafted pieces to make any new house feel like home.", image: set1?.image_url },
    { title: set2?.title || "The Festive Edit", description: set2?.description || "Celebrate the season with thoughtfully chosen decor that brings warmth and joy.", image: set2?.image_url },
    { title: set3?.title || "The Everyday Edit", description: set3?.description || "Small touches of beauty for daily living — perfect for gifting just because.", image: set3?.image_url },
  ];

  const handleBlurValidate = (field: keyof CustomerFormErrors) => {
    const allErrors = validateCustomerForm(customerForm);
    setCustomerErrors((prev) => ({ ...prev, [field]: allErrors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCustomerForm(customerForm);
    setCustomerErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setSending(true);

    const fullName = [customerForm.salutation, customerForm.firstName, customerForm.lastName].filter(Boolean).join(" ");

    try {
      await supabase.from("gift_enquiries").insert({
        full_name: fullName,
        salutation: customerForm.salutation,
        first_name: customerForm.firstName.trim(),
        last_name: customerForm.lastName.trim() || null,
        email: customerForm.email.trim(),
        mobile: "+91" + customerForm.mobile.replace(/\s/g, ""),
        city: customerForm.city || null,
        state: customerForm.state || null,
        pincode: customerForm.pincode || null,
        enquiry_type: enquiryType,
        service_type: serviceType || null,
        contact_method: contactMethod || null,
        message: message.trim().slice(0, 1000) || null,
      });

      try {
        await supabase.functions.invoke("send-order-notification", {
          body: {
            type: "query",
            name: fullName,
            email: customerForm.email,
            message: `[Gift Enquiry - ${enquiryType}] Service: ${serviceType || "N/A"}, Contact: ${contactMethod || "N/A"}, Message: ${message || "N/A"}`,
          },
        });
      } catch {
        // non-blocking
      }

      toast.success("Thank you! We'll be in touch soon.");
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const inputClass = "w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground rounded-sm focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Curated with Love</p>
          <h1 className="text-3xl md:text-4xl font-light text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            The Gift Shop
          </h1>
          <p className="text-sm text-muted-foreground mt-4 max-w-lg mx-auto">
            Thoughtfully curated gift sets perfect for every occasion — housewarming, weddings, festivals, or just because.
          </p>
        </div>

        {/* Curated Gift Sets */}
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {curatedSets.map((set, i) => (
              <div key={i} className="text-center">
                <div className="aspect-[4/5] bg-muted border border-border rounded-sm overflow-hidden mb-4 flex items-center justify-center">
                  {set.image ? (
                    <img src={set.image} alt={set.title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <span className="text-muted-foreground text-xs tracking-widest uppercase">Coming Soon</span>
                  )}
                </div>
                <h3 className="text-lg font-light text-foreground mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {set.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{set.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="bg-muted py-12 md:py-16">
          <div className="max-w-lg mx-auto px-6">
            <h2 className="text-xl md:text-2xl font-light text-foreground text-center mb-2 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Let's Connect
            </h2>
            <p className="text-xs text-muted-foreground tracking-wide text-center mb-8">
              Need assistance? Our team is here for you. Available across India.
            </p>

            {submitted ? (
              <div className="text-center py-8">
                <p className="text-sm text-primary mb-2">Thank you for reaching out!</p>
                <p className="text-xs text-muted-foreground">We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <CustomerFormFields
                  form={customerForm}
                  onChange={setCustomerForm}
                  errors={customerErrors}
                  onBlurValidate={handleBlurValidate}
                />

                {/* Enquiry Type */}
                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-2">I'd like to</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="enquiryType" value="enquire" checked={enquiryType === "enquire"} onChange={() => setEnquiryType("enquire")} className="accent-primary" />
                      <span className="text-sm text-foreground">Enquire</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="enquiryType" value="appointment" checked={enquiryType === "appointment"} onChange={() => setEnquiryType("appointment")} className="accent-primary" />
                      <span className="text-sm text-foreground">Book a Consultation</span>
                    </label>
                  </div>
                </div>

                {/* Service Type */}
                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Select Service</label>
                  <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className={inputClass}>
                    <option value="">Select Service</option>
                    <option value="gifting">Gifting Consultation</option>
                    <option value="bulk">Bulk / Corporate Orders</option>
                    <option value="custom">Custom Curation</option>
                    <option value="general">General Enquiry</option>
                  </select>
                </div>

                {/* Preferred Contact Method */}
                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Preferred Contact Method</label>
                  <select value={contactMethod} onChange={(e) => setContactMethod(e.target.value)} className={inputClass}>
                    <option value="">Select a method</option>
                    <option value="email">Email</option>
                    <option value="call">Call</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Message</label>
                  <textarea
                    maxLength={1000}
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you're looking for..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button type="submit" disabled={sending} className="w-full bg-primary text-primary-foreground py-3 text-xs tracking-[0.15em] uppercase hover:opacity-90 transition-opacity rounded-sm disabled:opacity-50">
                  {sending ? "Submitting..." : "Submit"}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Products */}
        {isLoading ? (
          <div className="max-w-7xl mx-auto px-6 py-16">
            <p className="text-center text-muted-foreground">Loading products...</p>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl md:text-2xl font-light text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Gift Sets
              </h2>
              <SortDropdown sort={sort} onSortChange={setSort} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.slug}`}>
                  <ProductCard
                    product={{
                      id: product.id,
                      name: product.name,
                      description: product.description || "",
                      price: product.price,
                      image: product.product_images?.[0]?.image_url || "/placeholder.svg",
                      category: product.category as any,
                      tag: product.tag || undefined,
                    }}
                  />
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <NewsletterBar />
      </main>
      <Footer />
    </div>
  );
};

export default GiftShop;
