import { useEffect, useRef } from "react";

interface AnnouncementTickerProps {
  messages?: string[];
}

const AnnouncementTicker = ({
  messages = [
    "Free shipping on orders above ₹1,499",
    "Made one piece at a time on a terrace in Gurugram",
  ],
}: AnnouncementTickerProps) => {
  const tickerRef = useRef<HTMLDivElement>(null);

  // Duplicate messages to create seamless loop
  const tickerContent = [...messages, ...messages, ...messages, ...messages];

  return (
    <div className="bg-primary text-primary-foreground overflow-hidden whitespace-nowrap py-1.5 text-xs tracking-wider">
      <div
        ref={tickerRef}
        className="inline-flex animate-ticker"
      >
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
