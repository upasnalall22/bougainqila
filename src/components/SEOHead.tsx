import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
}

const SEOHead = ({
  title = "BougenQila — Handcrafted Clay Home Decor",
  description = "BougenQila — Handcrafted clay home decor & accessories. Every piece is one of a kind.",
  canonical,
  ogImage = "https://lovable.dev/opengraph-image-p98pqg.png",
  type = "website",
  jsonLd,
}: SEOHeadProps) => {
  const fullTitle = title.includes("BougenQila") ? title : `${title} — BougenQila`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      {canonical && <meta property="og:url" content={canonical} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEOHead;
