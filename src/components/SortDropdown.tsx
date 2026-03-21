import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type SortOption = "newest" | "price-asc" | "price-desc" | "bestseller";

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Bestsellers", value: "bestseller" },
];

interface SortDropdownProps {
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
}

export function sortProducts<T extends { price: number; best_seller?: boolean; created_at: string }>(
  products: T[],
  sort: SortOption
): T[] {
  return [...products].sort((a, b) => {
    switch (sort) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "bestseller": return (b.best_seller ? 1 : 0) - (a.best_seller ? 1 : 0);
      case "newest":
      default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });
}

const SortDropdown = ({ sort, onSortChange }: SortDropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-sm border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors inline-flex items-center gap-1.5"
      >
        Sort: {sortOptions.find((s) => s.value === sort)?.label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-sm shadow-lg z-20 min-w-[180px]">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onSortChange(opt.value); setOpen(false); }}
                className={`block w-full text-left px-4 py-2.5 text-xs tracking-wide transition-colors ${
                  sort === opt.value ? "text-primary bg-muted" : "text-foreground/80 hover:bg-muted"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SortDropdown;
