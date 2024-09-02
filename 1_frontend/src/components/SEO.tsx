import Head from "next/head";

export default function SEO({
  title = "zapin.me",
  description = "an open-source platform where users can pin messages on a global map, with visibility determined by the amount of Satoshis paid via the Lightning Network.",
  siteName = "zapin.me",
  canonical = "https://zapin.me",
  ogImage = "https://zapin.me/zapin.me.png",
  ogType = "website",
  //   twitterHandle = "@zapin.me",
}) {
  return (
    <Head>
      <title key="title">{`${title} | ${description}`}</title>

      <link rel="icon" href="map-pin-check-inside.svg" />

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
      <meta key="og_url" property="og:url" content={canonical} />
      <meta key="og_site_name" property="og:site_name" content={siteName} />
      <meta key="og_image" property="og:image" content={ogImage} />
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

      <link rel="canonical" href={canonical} />

      <link rel="shortcut icon" href="/favicon.ico" />
    </Head>
  );
}
