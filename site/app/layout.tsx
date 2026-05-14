import type { Metadata } from "next";
import "./globals.css";

const TITLE = "unisphincs";
const DESCRIPTION =
  "post-quantum signatures for the next ethereum. uniswap-ready toolkit around sphincs-.";
const SITE_URL = "https://unisphincs.vercel.app";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "unisphincs",
    images: [
      {
        url: "/logo_transparent.png",
        width: 378,
        height: 284,
        alt: "unisphincs",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    site: "@UniSphincs",
    creator: "@UniSphincs",
    images: ["/logo_transparent.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
