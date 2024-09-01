import Head from "next/head";

const DOMAIN = "https://zapin.me";
const DEFAULT_OG_IMAGE = "https://zapin.me/zapin.me.webp";

export default function SEO({
  title = "Zapin.me",
  description = "Zapin.me is an open-source platform where users can pin messages on a global map, with visibility determined by the amount of Satoshis paid via the Lightning Network.",
  siteName = "zapin.me",
  canonical = DOMAIN,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  //   twitterHandle = "@zapin.me",
}) {
  return (
    <Head>
      <title key="title">{`${title} – ${siteName}`}</title>
      <meta name="description" content={description} />
      <meta key="og_type" property="og:type" content={ogType} />
      <meta key="og_title" property="og:title" content={title} />
      <meta
        key="og_description"
        property="og:description"
        content={description}
      />
      <meta key="og_locale" property="og:locale" content="en_IE" />
      <meta key="og_site_name" property="og:site_name" content={siteName} />
      <meta key="og_url" property="og:url" content={canonical ?? DOMAIN} />
      <meta key="og_site_name" property="og:site_name" content={siteName} />
      <meta
        key="og_image"
        property="og:image"
        content={ogImage ?? DEFAULT_OG_IMAGE}
      />
      <meta
        key="og_image:alt"
        property="og:image:alt"
        content={`${title} | ${siteName}`}
      />
      <meta key="og_image:width" property="og:image:width" content="1200" />
      <meta key="og_image:height" property="og:image:height" content="630" />

      <meta name="robots" content="index,follow" />

      {/* {twitterHandle && (
        <>
          <meta
            key="twitter:card"
            name="twitter:card"
            content="summary_large_image"
          />
          <meta
            key="twitter:site"
            name="twitter:site"
            content={twitterHandle}
          />
          <meta
            key="twitter:creator"
            name="twitter:creator"
            content={twitterHandle}
          />
          <meta key="twitter:title" property="twitter:title" content={title} />
          <meta
            key="twitter:description"
            property="twitter:description"
            content={description}
          />
        </>
      )} */}

      <link rel="canonical" href={canonical ?? DOMAIN} />

      <link rel="shortcut icon" href="/favicon.ico" />
    </Head>
  );
}
