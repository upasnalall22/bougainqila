import { Leaf, Truck, Heart } from "lucide-react";

const badges = [
  {
    icon: Leaf,
    title: "100% Handmade",
    description: "Crafted with care from our terrace studio",
  },
  {
    icon: Truck,
    title: "Pan-India Delivery",
    description: "We ship to all pin codes across India",
  },
  {
    icon: Heart,
    title: "Made Sustainably",
    description: "Eco-friendly materials & processes",
  },
];

const TrustBadges = () => {
  return (
    <section className="border-y border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {badges.map((badge) => (
            <div key={badge.title} className="flex items-center gap-4">
              <badge.icon className="w-6 h-6 text-primary flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-foreground">{badge.title}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
