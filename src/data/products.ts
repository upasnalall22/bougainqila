export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "windchimes" | "letterings" | "containers" | "hair-accents" | "gift-set";
  tag?: string;
}

export const products: Product[] = [
  // Windchimes
  { id: "wc-1", name: "Terracotta Bell Chime", price: 1450, image: "/placeholder.svg", category: "windchimes", tag: "Bestseller" },
  { id: "wc-2", name: "Rustic Clay Wind Hanger", price: 1250, image: "/placeholder.svg", category: "windchimes" },
  { id: "wc-3", name: "Bohemian Breeze Chime", price: 1650, image: "/placeholder.svg", category: "windchimes" },
  { id: "wc-4", name: "Garden Melody Bells", price: 1350, image: "/placeholder.svg", category: "windchimes", tag: "New" },
  { id: "wc-5", name: "Minimalist Clay Chime", price: 999, image: "/placeholder.svg", category: "windchimes" },
  { id: "wc-6", name: "Artisan Cluster Chime", price: 1850, image: "/placeholder.svg", category: "windchimes" },

  // Letterings
  { id: "lt-1", name: "Personalised Name Plate", price: 1200, image: "/placeholder.svg", category: "letterings", tag: "Bestseller" },
  { id: "lt-2", name: "Clay Welcome Sign", price: 950, image: "/placeholder.svg", category: "letterings" },
  { id: "lt-3", name: "Custom Quote Lettering", price: 1500, image: "/placeholder.svg", category: "letterings" },
  { id: "lt-4", name: "House Number Plate", price: 850, image: "/placeholder.svg", category: "letterings", tag: "New" },
  { id: "lt-5", name: "Festive Clay Letters", price: 1100, image: "/placeholder.svg", category: "letterings" },
  { id: "lt-6", name: "Nursery Name Plaque", price: 1350, image: "/placeholder.svg", category: "letterings" },

  // Containers
  { id: "ct-1", name: "Handmade Clay Planter", price: 750, image: "/placeholder.svg", category: "containers", tag: "Bestseller" },
  { id: "ct-2", name: "Terracotta Herb Pot", price: 550, image: "/placeholder.svg", category: "containers" },
  { id: "ct-3", name: "Decorative Bowl Set", price: 1200, image: "/placeholder.svg", category: "containers" },
  { id: "ct-4", name: "Sculpted Trinket Dish", price: 650, image: "/placeholder.svg", category: "containers", tag: "New" },
  { id: "ct-5", name: "Textured Vase", price: 1100, image: "/placeholder.svg", category: "containers" },
  { id: "ct-6", name: "Clay Candle Holder", price: 850, image: "/placeholder.svg", category: "containers" },

  // Hair Accents
  { id: "ha-1", name: "Clay Floral Hair Clip", price: 450, image: "/placeholder.svg", category: "hair-accents", tag: "Bestseller" },
  { id: "ha-2", name: "Boho Clay Hair Pin Set", price: 650, image: "/placeholder.svg", category: "hair-accents" },
  { id: "ha-3", name: "Leaf Motif Barrette", price: 550, image: "/placeholder.svg", category: "hair-accents", tag: "New" },
  { id: "ha-4", name: "Pearl & Clay Comb", price: 850, image: "/placeholder.svg", category: "hair-accents" },
  { id: "ha-5", name: "Mini Clay Claw Clips", price: 350, image: "/placeholder.svg", category: "hair-accents" },
  { id: "ha-6", name: "Statement Hair Slide", price: 750, image: "/placeholder.svg", category: "hair-accents" },

  // Gift Sets
  { id: "gs-1", name: "Curated Home Gift Box", price: 2500, image: "/placeholder.svg", category: "gift-set", tag: "Popular" },
  { id: "gs-2", name: "Self-Care Clay Kit", price: 1800, image: "/placeholder.svg", category: "gift-set" },
  { id: "gs-3", name: "Festive Hamper", price: 3200, image: "/placeholder.svg", category: "gift-set", tag: "New" },
  { id: "gs-4", name: "Mini Artisan Bundle", price: 1500, image: "/placeholder.svg", category: "gift-set" },
  { id: "gs-5", name: "Wedding Favour Set", price: 2800, image: "/placeholder.svg", category: "gift-set" },
  { id: "gs-6", name: "New Home Gift Set", price: 2200, image: "/placeholder.svg", category: "gift-set" },
];
