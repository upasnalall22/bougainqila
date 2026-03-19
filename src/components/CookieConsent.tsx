import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie_consent");
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[55] bg-foreground text-background px-4 py-4 md:px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
        <p className="text-xs leading-relaxed flex-1">
          We use cookies to enhance your browsing experience and analyse site traffic. By clicking "Accept", you consent to our use of cookies.{" "}
          <Link to="/cookie-policy" className="underline hover:opacity-80">
            Read our Cookie Policy
          </Link>
          .
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={accept}
            className="bg-primary text-primary-foreground px-5 py-2 text-[10px] tracking-[0.15em] uppercase rounded-sm hover:opacity-90 transition-opacity"
          >
            Accept
          </button>
          <button
            onClick={() => setVisible(false)}
            className="border border-background/30 px-5 py-2 text-[10px] tracking-[0.15em] uppercase rounded-sm hover:bg-background/10 transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
