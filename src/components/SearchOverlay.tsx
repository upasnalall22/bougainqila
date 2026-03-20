import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  image_url: string | null;
}

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ open, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const term = `%${query.trim()}%`;
      const { data } = await supabase
        .from("products")
        .select("id, name, slug, category, price, product_images(image_url)")
        .or(`name.ilike.${term},category.ilike.${term},tag.ilike.${term}`)
        .limit(8);

      const mapped: SearchResult[] = (data ?? []).map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        price: p.price,
        image_url: p.product_images?.[0]?.image_url ?? null,
      }));
      setResults(mapped);
      setLoading(false);
    }, 300);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex flex-col">
      <div className="max-w-2xl w-full mx-auto px-6 pt-20">
        <div className="flex items-center gap-3 border-b border-border pb-3">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-lg text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-2 max-h-[60vh] overflow-y-auto">
          {loading && <p className="text-sm text-muted-foreground">Searching...</p>}
          {!loading && query && results.length === 0 && (
            <p className="text-sm text-muted-foreground">No products found for "{query}"</p>
          )}
          {results.map((r) => (
            <Link
              key={r.id}
              to={`/product/${r.slug}`}
              onClick={onClose}
              className="flex items-center gap-4 p-3 rounded-sm hover:bg-muted transition-colors"
            >
              <div className="w-14 h-14 rounded-sm overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={r.image_url || "/placeholder.svg"}
                  alt={r.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{r.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{r.category}</p>
              </div>
              <p className="text-sm text-foreground">₹{r.price.toLocaleString("en-IN")}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
