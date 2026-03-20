import { useHomepageContent } from "@/hooks/useCMS";

const AnnouncementTicker = () => {
  const { data: content } = useHomepageContent("announcement");

  // Parse messages from description field (pipe-separated)
  const messages = content?.description
    ? content.description.split("|").map((m: string) => m.trim()).filter(Boolean)
    : ["Free shipping on orders above ₹1,499", "Made one piece at a time on a terrace in Gurugram"];

  // Duplicate messages to create seamless loop
  const tickerContent = [...messages, ...messages, ...messages, ...messages];

  return (
    <div className="bg-primary text-primary-foreground overflow-hidden whitespace-nowrap py-1.5 text-xs tracking-wider">
      <div className="inline-flex animate-ticker">
        {tickerContent.map((msg, i) => (
          <span key={i} className="mx-12 inline-block">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementTicker;
