import GoogleAnalytics from "@/components/GoogleAnalytics";
import SEO from "@/components/SEO";
import "@/styles/globals.css";
import { sendEvent } from "@/Utils/analytics";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    sendEvent({
      action: "site_visit",
      category: "Engagement",
      label: "User Arrived at Site",
    });
  }, []);

  return (
    <>
      <GoogleAnalytics />
      <SEO />
      <Component {...pageProps} />
    </>
  );
}
