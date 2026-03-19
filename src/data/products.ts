export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "windchimes" | "letterings" | "containers" | "hair-accents" | "gift-set";
  tag?: string;
}

export const products: Product[] = [
  // Windchimes
  { id: "wc-1", name: "Terracotta Bell Chime", description: "Hand-sculpted terracotta bells with a soothing melodic tone.", price: 1450, image: "/placeholder.svg", category: "windchimes", tag: "Bestseller" },
  { id: "wc-2", name: "Rustic Clay Wind Hanger", description: "Earthy rustic clay pieces strung on natural jute cord.", price: 1250, image: "/placeholder.svg", category: "windchimes" },
  { id: "wc-3", name: "Bohemian Breeze Chime", description: "Boho-inspired clay discs with hand-painted motifs.", price: 1650, image: "/placeholder.svg", category: "windchimes" },
  { id: "wc-4", name: "Garden Melody Bells", description: "Petite garden bells crafted for gentle outdoor melodies.", price: 1350, image: "/placeholder.svg", category: "windchimes", tag: "New" },
  { id: "wc-5", name: "Minimalist Clay Chime", description: "Clean lines and neutral tones for modern spaces.", price: 999, image: "/placeholder.svg", category: "windchimes" },
  { id: "wc-6", name: "Artisan Cluster Chime", description: "Clustered clay forms creating a rich harmonic sound.", price: 1850, image: "/placeholder.svg", category: "windchimes" },

  // Letterings
  { id: "lt-1", name: "Personalised Name Plate", description: "Custom clay name plate with your choice of lettering.", price: 1200, image: "/placeholder.svg", category: "letterings", tag: "Bestseller" },
  { id: "lt-2", name: "Clay Welcome Sign", description: "Warm welcome sign handcrafted in natural clay.", price: 950, image: "/placeholder.svg", category: "letterings" },
  { id: "lt-3", name: "Custom Quote Lettering", description: "Your favourite quote sculpted in elegant clay letters.", price: 1500, image: "/placeholder.svg", category: "letterings" },
  { id: "lt-4", name: "House Number Plate", description: "Durable clay number plate for your front door.", price: 850, image: "/placeholder.svg", category: "letterings", tag: "New" },
  { id: "lt-5", name: "Festive Clay Letters", description: "Decorative letters perfect for festive celebrations.", price: 1100, image: "/placeholder.svg", category: "letterings" },
  { id: "lt-6", name: "Nursery Name Plaque", description: "Adorable personalised plaque for a child's nursery.", price: 1350, image: "/placeholder.svg", category: "letterings" },

  // Containers
  { id: "ct-1", name: "Handmade Clay Planter", description: "Textured clay planter ideal for succulents and herbs.", price: 750, image: "/placeholder.svg", category: "containers", tag: "Bestseller" },
  { id: "ct-2", name: "Terracotta Herb Pot", description: "Classic terracotta pot sized for kitchen herb gardens.", price: 550, image: "/placeholder.svg", category: "containers" },
  { id: "ct-3", name: "Decorative Bowl Set", description: "Set of three nesting bowls with organic shapes.", price: 1200, image: "/placeholder.svg", category: "containers" },
  { id: "ct-4", name: "Sculpted Trinket Dish", description: "Small sculpted dish for jewellery and keepsakes.", price: 650, image: "/placeholder.svg", category: "containers", tag: "New" },
  { id: "ct-5", name: "Textured Vase", description: "Statement vase with a tactile, hand-carved surface.", price: 1100, image: "/placeholder.svg", category: "containers" },
  { id: "ct-6", name: "Clay Candle Holder", description: "Elegant clay holder designed for taper candles.", price: 850, image: "/placeholder.svg", category: "containers" },

  // Hair Accents
  { id: "ha-1", name: "Clay Floral Hair Clip", description: "Delicate floral motif clip moulded from polymer clay.", price: 450, image: "/placeholder.svg", category: "hair-accents", tag: "Bestseller" },
  { id: "ha-2", name: "Boho Clay Hair Pin Set", description: "Set of three bohemian-style clay hair pins.", price: 650, image: "/placeholder.svg", category: "hair-accents" },
  { id: "ha-3", name: "Leaf Motif Barrette", description: "Nature-inspired leaf barrette in muted earth tones.", price: 550, image: "/placeholder.svg", category: "hair-accents", tag: "New" },
  { id: "ha-4", name: "Pearl & Clay Comb", description: "Decorative comb blending freshwater pearls with clay.", price: 850, image: "/placeholder.svg", category: "hair-accents" },
  { id: "ha-5", name: "Mini Clay Claw Clips", description: "Petite claw clips in assorted pastel clay shades.", price: 350, image: "/placeholder.svg", category: "hair-accents" },
  { id: "ha-6", name: "Statement Hair Slide", description: "Bold geometric slide for an effortless updo.", price: 750, image: "/placeholder.svg", category: "hair-accents" },

  // Gift Sets
  { id: "gs-1", name: "Curated Home Gift Box", description: "A thoughtful mix of home decor favourites in one box.", price: 2500, image: "/placeholder.svg", category: "gift-set", tag: "Popular" },
  { id: "gs-2", name: "Self-Care Clay Kit", description: "Relaxation essentials paired with handmade clay pieces.", price: 1800, image: "/placeholder.svg", category: "gift-set" },
  { id: "gs-3", name: "Festive Hamper", description: "Celebrate the season with our premium festive hamper.", price: 3200, image: "/placeholder.svg", category: "gift-set", tag: "New" },
  { id: "gs-4", name: "Mini Artisan Bundle", description: "Compact bundle of artisan clay treasures.", price: 1500, image: "/placeholder.svg", category: "gift-set" },
  { id: "gs-5", name: "Wedding Favour Set", description: "Elegant clay keepsakes perfect as wedding favours.", price: 2800, image: "/placeholder.svg", category: "gift-set" },
  { id: "gs-6", name: "New Home Gift Set", description: "Welcome-home essentials wrapped in artisan charm.", price: 2200, image: "/placeholder.svg", category: "gift-set" },
];
