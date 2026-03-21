import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterBar from "@/components/NewsletterBar";
import ProductCard from "@/components/ProductCard";
import SEOHead from "@/components/SEOHead";
import { useProducts } from "@/hooks/useProducts";
import { useCategoryContent } from "@/hooks/useCMS";
import { useParams, Link } from "react-router-dom";

const subCategories = [
{ label: "All", slug: "" },
{ label: "Windchimes", slug: "windchimes" },
{ label: "Letterings", slug: "letterings" },
{ label: "Containers", slug: "containers" },
{ label: "Hair Accents", slug: "hair-accents" }];


const homeLivingCategories = ["windchimes", "letterings", "containers", "hair-accents"];

const HomeLiving = () => {
  const { category } = useParams<{category?: string;}>();
  const { data: allProducts, isLoading } = useProducts(category || undefined);
  const { data: catContent } = useCategoryContent(category);

  const products = category ?
  allProducts :
  allProducts?.filter((p) => homeLivingCategories.includes(p.category));

  const activeLabel = subCategories.find((s) => s.slug === (category || ""))?.label || "All";
  const pageTitle = catContent?.meta_title || (category ? `${activeLabel} — Home & Living` : "Home & Living Collection");
  const pageDesc = catContent?.meta_description || "Browse our handcrafted clay home & living collection.";

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={pageTitle}
        description={pageDesc}
        canonical={`${window.location.origin}${category ? `/home-living/${category}` : "/home-living"}`} />
      
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
        {catContent?.banner_image_url &&
        <div className="w-full h-48 md:h-64 rounded-sm overflow-hidden mb-8">
            <img src={catContent.banner_image_url} alt={catContent.name} className="w-full h-full object-cover" />
          </div>
        }
        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Collections</p>
          <h1 className="text-3xl md:text-4xl font-light text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {catContent?.name || "Home & Living"}
          </h1>
          {catContent?.description &&
          <p className="text-sm text-muted-foreground mt-3 max-w-lg mx-auto">{catContent.description}</p>
          }
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
          <div className="flex flex-wrap gap-3">
            {subCategories.map((sub) =>
            <Link
              key={sub.slug}
              to={sub.slug ? `/home-living/${sub.slug}` : "/home-living"}
              className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-sm border transition-colors ${
              activeLabel === sub.label ?
              "bg-primary text-primary-foreground border-primary" :
              "border-border text-muted-foreground hover:text-foreground hover:border-foreground"}`
              }>
                {sub.label}
              </Link>
            )}
          </div>
          <SortDropdown sort={sort} onSortChange={setSort} />
        </div>

        {isLoading ?
        <p className="text-center text-muted-foreground">Loading products...</p> :
        products && products.length > 0 ?
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) =>
          <Link key={product.id} to={`/product/${product.slug}`}>
                <ProductCard
              product={{
                id: product.id,
                name: product.name,
                description: product.description || "",
                price: product.price,
                image: product.product_images?.[0]?.image_url || "/placeholder.svg",
                category: product.category,
                tag: product.tag || undefined,
                featured: product.featured,
                best_seller: (product as any).best_seller
              }} />
            
              </Link>
          )}
          </div> :

        <p className="text-center text-muted-foreground">New Products will be added here soon!</p>
        }
      </main>
      <NewsletterBar />
      <Footer />
    </div>);

};

export default HomeLiving;