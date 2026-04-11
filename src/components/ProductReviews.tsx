import { useState } from "react";
import { Star } from "lucide-react";
import { useProductReviews, useSubmitReview } from "@/hooks/useReviews";
import { toast } from "sonner";

interface ProductReviewsProps {
  productId: string;
}

const StarRating = ({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        onClick={() => interactive && onRate?.(s)}
        className={interactive ? "cursor-pointer" : "cursor-default"}
        disabled={!interactive}
      >
        <Star className={`w-4 h-4 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-border"}`} />
      </button>
    ))}
  </div>
);

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { data: reviews, isLoading } = useProductReviews(productId);
  const submitReview = useSubmitReview();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const avgRating = reviews?.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    submitReview.mutate(
      { product_id: productId, reviewer_name: name.trim(), rating, review_text: text.trim() || "" },
      {
        onSuccess: () => {
          toast.success("Thank you for your review!");
          setName("");
          setRating(5);
          setText("");
          setShowForm(false);
        },
        onError: () => toast.error("Could not submit review. Please try again."),
      }
    );
  };

  return (
    <div className="mt-16 border-t border-border pt-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-light text-foreground mb-1" style={{ fontFamily: "var(--font-heading)" }}>
            Customer Reviews
          </h2>
          {avgRating && (
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(Number(avgRating))} />
              <span className="text-sm text-muted-foreground">{avgRating} out of 5 · {reviews?.length} review{reviews?.length !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs tracking-[0.15em] uppercase border border-border px-4 py-2 rounded-sm hover:bg-muted transition-colors"
        >
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border border-border rounded-sm p-5 mb-8 space-y-4">
          <div>
            <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Your Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
              className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Rating</label>
            <StarRating rating={rating} onRate={setRating} interactive />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Your Review</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={1000}
              rows={3}
              className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitReview.isPending || !name.trim()}
            className="bg-primary text-primary-foreground px-6 py-2.5 text-xs tracking-[0.15em] uppercase rounded-sm hover:opacity-90 disabled:opacity-50"
          >
            {submitReview.isPending ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading reviews...</p>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-border pb-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">{r.reviewer_name}</span>
                  <StarRating rating={r.rating} />
                </div>
                <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</span>
              </div>
              {r.review_text && <p className="text-sm text-foreground/80 leading-relaxed">{r.review_text}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">No reviews yet. Be the first to review this product!</p>
      )}
    </div>
  );
};

export default ProductReviews;
