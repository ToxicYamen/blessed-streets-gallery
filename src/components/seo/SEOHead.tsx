import { Helmet } from "react-helmet-async";

const SITE = "https://blessedstreets.de";
const DEFAULT_IMAGE = `${SITE}/og-image.png`;
const DEFAULT_TITLE = "Blesssed Streets® | Premium Streetwear & Hoodies — Made in Germany";
const DEFAULT_DESCRIPTION =
  "Premium Streetwear aus Deutschland. Handgefertigte Hoodies in limitierter Auflage — Logo-Embroidery, Cotton-Fleece, schwarz und khaki. Versand DE / AT / CH, 14-Tage-Widerruf.";

export type JsonLd = Record<string, unknown>;

interface SEOHeadProps {
  /** Page title; appended to brand. Omit for the homepage default. */
  title?: string;
  /** Meta description; ~150-160 chars. */
  description?: string;
  /** Path on the site (e.g. "/shop"); used for canonical + og:url. */
  canonicalPath?: string;
  /** OG/Twitter image absolute URL. */
  image?: string;
  /** og:type — "website" | "product" | "article". */
  type?: "website" | "product" | "article";
  /** Hide page from search results. */
  noIndex?: boolean;
  /** One or more JSON-LD objects to inline. */
  jsonLd?: JsonLd | JsonLd[];
  /** Breadcrumb trail; auto-rendered as BreadcrumbList. */
  breadcrumbs?: { name: string; url: string }[];
}

/**
 * SEOHead: per-route meta + JSON-LD for the Vite SPA.
 *
 * Modern AI crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended) execute
 * JavaScript, so client-rendered Helmet tags are picked up. For maximum coverage
 * the global defaults still live in `index.html`.
 */
export function SEOHead({
  title,
  description,
  canonicalPath,
  image,
  type = "website",
  noIndex,
  jsonLd,
  breadcrumbs,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} · Blesssed Streets` : DEFAULT_TITLE;
  const desc = description ?? DEFAULT_DESCRIPTION;
  const canonical = canonicalPath ? `${SITE}${canonicalPath}` : SITE;
  const img = image ?? DEFAULT_IMAGE;

  const scripts: JsonLd[] = [];
  if (jsonLd) scripts.push(...(Array.isArray(jsonLd) ? jsonLd : [jsonLd]));
  if (breadcrumbs && breadcrumbs.length > 0) {
    scripts.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: `${SITE}${b.url}`,
      })),
    });
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />
      {noIndex ? <meta name="robots" content="noindex,nofollow" /> : null}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Blesssed Streets" />
      <meta property="og:locale" content="de_DE" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />

      {/* JSON-LD */}
      {scripts.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
