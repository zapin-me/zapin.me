import GoogleAnalytics from "@/components/GoogleAnalytics";
import SEO from "@/components/SEO";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleAnalytics />
      <SEO />
      <Component {...pageProps} />;
    </>
  );
}
