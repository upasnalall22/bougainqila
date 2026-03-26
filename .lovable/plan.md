# Brand Language Adaptation, Logo Replacement, Newsletter Popup with Backend

## Summary

Adapt all website copy to match the BougainQila brand guidebook voice (unhurried, tactile, honest, intimate, story-led). Replace the logo with the uploaded master logo file. Update the newsletter popup to use session-based (not localStorage) display logic and store subscriber data in the database.

---

## 1. Replace Logo

- Copy `user-uploads://BQ_LOGO_MASTER_1.png` to `src/assets/logo.png` (overwrite existing)
- No component changes needed — Navbar already imports from `@/assets/logo.png`

## 2. Adapt Language Across Components

Apply brand guidebook voice throughout. Key vocabulary shifts: "handcrafted" not "handcrafted artisan", "piece" not "product", "one of a kind" not "unique exclusive", "handmade" not "premium", "terrace studio" not "workshop", "bring home" not "buy now", "made with intention" not "made with love".

### Files and specific changes:

**AnnouncementTicker.tsx**

- "Free Shipping on Orders Above ₹1,499 ✨" → "Free shipping on orders above ₹1,499"
- "Handcrafted with Love — Each Piece is One of a Kind 🏺" → "Made one piece at a time on a terrace in Gurugram"
- Remove emojis (brand never uses them in this way)

**HeroBanner.tsx** (default/fallback text)

- subtitle: "Handcrafted with Love" → "Imperfectly Perfect"
- title: "One of a Kind\nClay Creations" → "There is beauty in the broken\nand magic in the slow."
- description: current generic text → "Handmade home decor born from a terrace garden. Each piece carries the warmth of slow craft with an organic spirit."
- buttonText: "Explore More" → "Shop Now"

**CategoryGrid.tsx**

- Section subtitle: "Collections" (keep)
- Section title: "Shop by Category" → "Where slow things breathe"
- CTA text: "Explore More →" → "Explore →"

**AboutSection.tsx** (fallback text)

- subtitle: "Our Story" → "The Heart of it All"
- title: "Where slow things live." → "Where it all began"
- description: Replace generic text with brand-voice copy from reference site: "It started with a few pots on a terrace and a heart full of questions..."
- buttonText: "Learn More About Us →" → "Read Our Story →"

**FeaturedProducts.tsx**

- subtitle: "Curated" → "From the Studio"
- title: "A favorite story" (keep — "favorite story" is brand vocabulary)
- "Add to Cart" → "Bring Home"

**JournalSection.tsx**

- subtitle: "Journal" (keep)
- title: "Follow Our Story" → "From the Terrace"

**NewsletterBar.tsx**

- title: "Sign Up for Our Newsletter" → "Stay a while"
- description: "Subscribe to get special offers and updates." → "New pieces, behind-the-scenes stories and the occasional quiet thought — straight to your inbox."
- button: "Subscribe" → "Join"
- success: "Thank you for subscribing!" → "Welcome. You will hear from us soon."
- Save email to database (same table as popup)

**Footer.tsx**

- Brand description: "Handcrafted clay home decor & accessories. Every piece is one of a kind." → "Handmade home decor shaped one piece at a time on a terrace in Gurugram. No two are the same."
- "About Us" → "Our Story"
- "Contact" → "Connect"

**ProductDetail.tsx**

- Trust badge: "Hand-crafted" → "Handmade"
- "Add to Cart" → "Bring Home" / "Out of Stock" → "Sold Out"
- "You may also like" → "You might also like"
- Shipping text: keep factual tone

**CartDrawer.tsx**

- "Add to Cart" in recommendations → "Bring Home"

**Connect.tsx**

- subtitle: "Get in Touch" → "Say Hello"
- title: "Connect with Us" → "We would love to hear from you"
- success: "We'll get back to you shortly." → "Thank you. We will write back soon."
- button: "Send Message" → "Send"

**Checkout.tsx**

- No major language changes needed (transactional, factual — matches brand guidance for checkout)

## 3. Newsletter Popup — Session-Based + Backend Storage

### Database Migration

Create `newsletter_subscribers` table:

```sql
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  source text DEFAULT 'popup',
  subscribed_at timestamptz DEFAULT now()
);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous inserts" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read" ON public.newsletter_subscribers
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
```

### NewsletterPopup.tsx Changes

- Use `sessionStorage` instead of `localStorage` so popup shows once per session (not permanently dismissed)
- Update copy to brand voice:
  - Title: "Stay in the Loop" → "Before you go"
  - Description: "Get 10% off your first order when you subscribe to our newsletter." → "New pieces, stories from the terrace and the occasional quiet thought. We will only write when we have something worth saying."
  - Success: "Welcome aboard! Check your inbox." → "Welcome. You will hear from us soon."
  - Button: "Subscribe" → "Join"
- On submit, insert email into `newsletter_subscribers` table with `source: 'popup'`

### NewsletterBar.tsx Changes

- On submit, insert email into `newsletter_subscribers` table with `source: 'footer_bar'`

### Admin — View Subscribers

- Add a "Subscribers" section in AdminDashboard to list newsletter subscribers (read-only table)

---

## Technical Details

- **13 component files** edited for language updates
- **1 asset** replaced (logo)
- **1 database migration** (newsletter_subscribers table + RLS)
- **2 components** updated to write to database (NewsletterPopup, NewsletterBar)
- **1 admin tab** added (Subscribers list in AdminDashboard)
