import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronDown, Heart, Minus, Plus, Truck, CreditCard, Hand, Gift } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SEOHead from "@/components/SEOHead";
import { useProduct, useRelatedProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";

const trustBadges = [
  { icon: Truck, label: "Hassle-free Shipping" },
  { icon: CreditCard, label: "COD Available" },
  { icon: Hand, label: "Hand-crafted" },
  { icon: Gift, label: "Corporate Gifting" },
];

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const { data: product, isLoading } = useProduct(slug || "");
  const { data: relatedProducts } = useRelatedProducts(
    product?.category || "",
    product?.id || ""
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [shippingOpen, setShippingOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-muted-foreground">Product not found</p>
          <Link to="/shop" className="text-primary text-sm underline">Back to Shop</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const images = product.product_images?.sort((a, b) => a.display_order - b.display_order) || [];
  const colors = (product.colors as Array<{ name: string; hex: string }>) || [];
  const mainImage = images[selectedImage]?.image_url || "/placeholder.svg";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: images.map((img) => img.image_url),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={(product as any).meta_title || product.name}
        description={(product as any).meta_description || product.description || ""}
        canonical={`${window.location.origin}/product/${product.slug}`}
        ogImage={images[0]?.image_url}
        type="product"
        jsonLd={productJsonLd}
      />
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-3">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[500px]">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-sm overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? "border-primary" : "border-border"
                    }`}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {/* Main Image */}
            <div className="relative flex-1 aspect-square rounded-sm overflow-hidden bg-muted">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-red-500 text-red-500" : "text-foreground/60"}`} />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1
              className="text-2xl md:text-3xl font-light text-foreground mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-1">
              {product.original_price && (
                <span className="text-sm text-muted-foreground line-through">
                  MRP ₹{product.original_price.toLocaleString("en-IN")}.00
                </span>
              )}
              <span className="text-lg font-medium text-foreground">
                MRP ₹{product.price.toLocaleString("en-IN")}.00
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mb-6">Tax included. Shipping calculated at checkout.</p>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Description</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Materials Used */}
            {product.design_craft && (
              <div className="mb-6">
                <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Materials Used</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{product.design_craft}</p>
              </div>
            )}

            {/* Size */}
            {(product as any).size && (
              <div className="mb-6">
                <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Size</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{(product as any).size}</p>
              </div>
            )}

            {/* Ships within */}
            {product.ships_within && (
              <p className="text-xs text-muted-foreground mb-6">
                Usually ships within {product.ships_within}.
              </p>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                  Colour — <span className="normal-case">{colors[selectedColor]?.name}</span>
                </h3>
                <div className="flex gap-2">
                  {colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(i)}
                      className={`w-8 h-8 rounded-full border-2 transition-colors ${
                        selectedColor === i ? "border-primary" : "border-border"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Quantity</h3>
              <div className="inline-flex items-center border border-border rounded-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Stock Status */}
            {!product.in_stock && (
              <p className="text-sm text-destructive font-medium mb-3">Out of Stock</p>
            )}

            {/* Add to Cart */}
            <button
              onClick={() => addToCart(product.id, quantity)}
              disabled={!product.in_stock}
              className="w-full bg-primary text-primary-foreground py-3.5 text-xs tracking-[0.2em] uppercase rounded-sm hover:opacity-90 transition-opacity mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.in_stock ? "Add to Cart" : "Out of Stock"}
            </button>

            {/* Pickup */}
            <p className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5">
              <span className="text-green-600">✓</span>
              Pickup available at select locations
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-4 gap-3 mb-8 border-t border-b border-border py-6">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
                    <badge.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-[9px] leading-tight text-muted-foreground">{badge.label}</span>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="border-b border-border">
              <button
                onClick={() => setShippingOpen(!shippingOpen)}
                className="w-full flex items-center justify-between py-4 text-xs tracking-[0.15em] uppercase text-foreground"
              >
                Shipping Information
                <ChevronDown className={`w-4 h-4 transition-transform ${shippingOpen ? "rotate-180" : ""}`} />
              </button>
              {shippingOpen && (
                <div className="pb-4 text-sm text-muted-foreground leading-relaxed">
                  <p>We ship across India. Standard delivery takes 5-7 business days. Express shipping available at checkout.</p>
                  <p className="mt-2">Free shipping on orders above ₹1,500.</p>
                </div>
              )}
            </div>
            <div className="border-b border-border">
              <button
                onClick={() => setAskOpen(!askOpen)}
                className="w-full flex items-center justify-between py-4 text-xs tracking-[0.15em] uppercase text-foreground"
              >
                Ask a Question
                <ChevronDown className={`w-4 h-4 transition-transform ${askOpen ? "rotate-180" : ""}`} />
              </button>
              {askOpen && (
                <div className="pb-4 text-sm text-muted-foreground">
                  <p>
                    Have a question? Reach out to us at{" "}
                    <a href="mailto:kavanika@gmail.com" className="text-primary underline">kavanika@gmail.com</a>
                    {" "}or WhatsApp us at{" "}
                    <a href="https://wa.me/919810374919" className="text-primary underline">+91 98103 74919</a>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2
              className="text-center text-2xl font-light text-foreground mb-10"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              You may also like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} to={`/product/${rp.slug}`}>
                  <ProductCard
                    product={{
                      id: rp.id,
                      name: rp.name,
                      description: rp.description || "",
                      price: rp.price,
                      image: rp.product_images?.[0]?.image_url || "/placeholder.svg",
                      category: rp.category as any,
                      tag: rp.tag || undefined,
                    }}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
