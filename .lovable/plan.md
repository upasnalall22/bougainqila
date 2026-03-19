

## Plan: Build Homepage (Artisan Lab-inspired layout) with Supabase E-commerce

### Overview
Build a handmade home decor e-commerce site with a clean, minimal aesthetic inspired by the reference site. We'll use Supabase (via Lovable Cloud) for the backend — products, cart, orders, and auth. This plan covers the **homepage only**; additional pages (product detail, cart, checkout, auth) will follow.

### Your Product Categories
1. Handmade Clay Windchimes
2. Handmade Clay Lettering
3. Handmade Clay Containers
4. Handmade Jooda Stick Hair Accessories

### Homepage Sections (top to bottom)

1. **Navbar** — Logo (left), nav links (Shop, About, Contact — center/right), cart icon + account icon (right). Clean, minimal header with a warm off-white background.

2. **Hero Banner** — Full-width image area with overlay text: brand tagline and a "Shop Now" CTA button. Placeholder image for now (you'll replace with your own).

3. **Category Grid** — 4 cards (one per category) in a 2×2 grid on desktop, stacked on mobile. Each card has a placeholder image, category name, and "Explore" link.

4. **Featured Products** — Horizontal scroll or grid of 4-6 product cards with image, name, and price. Placeholder data for now.

5. **About/Story Section** — Split layout: image on one side, short brand story text on the other. Emphasizes the handmade, one-of-a-kind nature of your pieces.

6. **Footer** — Logo, quick links, social media icons, copyright.

### Design Tokens
- Warm, earthy palette: off-white background (`#FAF8F5`), dark charcoal text, warm accent color (terracotta/clay tone `#C4896B`)
- Clean sans-serif font (Inter or similar)
- Minimal borders, generous whitespace

### Technical Details

**Files to create/modify:**
- `src/index.css` — Update design tokens (warm palette)
- `src/pages/Index.tsx` — Full homepage with all sections
- `src/components/Navbar.tsx` — Top navigation
- `src/components/HeroBanner.tsx` — Hero section
- `src/components/CategoryGrid.tsx` — Category cards
- `src/components/FeaturedProducts.tsx` — Product cards
- `src/components/AboutSection.tsx` — Brand story
- `src/components/Footer.tsx` — Site footer

All product data will be hardcoded placeholders initially. Supabase integration (products table, cart, auth) will be added in a subsequent step when you're ready.

