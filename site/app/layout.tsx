import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "unisphincs",
  description:
    "post-quantum signatures for the next ethereum. uniswap-ready toolkit around sphincs-.",
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
