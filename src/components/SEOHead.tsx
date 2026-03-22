import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
  noindex?: boolean;
}

const SITE_URL = "https://bougenqila.lovable.app";
const OG_IMAGE = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4ecc4159-a0a2-434d-9f8b-1cf6ab4d756d/id-preview-ee2c3921--bff7b52e-cfe1-4a42-a7eb-3e3c0d7fc884.lovable.app-1773989906928.png";

const SEOHead = ({
  title = "BougainQila — Handcrafted Clay Home Decor",
  description = "BougainQila — Handcrafted clay home decor & accessories. Every piece is one of a kind.",
  canonical,
  ogImage = OG_IMAGE,
  type = "website",
  jsonLd,
  noindex = false,
}: SEOHeadProps) => {
  const location = useLocation();
  const fullTitle = title.includes("BougainQila") ? title : `${title} — BougainQila`;
  const canonicalUrl = canonical
    ? (canonical.startsWith("http") ? canonical : `${SITE_URL}${canonical}`)
    : `${SITE_URL}${location.pathname}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="BougainQila" />

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
