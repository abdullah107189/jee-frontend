import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import { StoreProvider } from "@/store/provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jeestore.com"),
  title: {
    default: "JEE — Authentic Electronics with Digital Warranty",
    template: "%s | JEE",
  },
  description:
    "Shop genuine electronics with verifiable digital warranty. Fans, AC, lights & appliances with QR-based warranty tracking across Bangladesh.",
  keywords: [
    "electronics bangladesh",
    "digital warranty",
    "ceiling fan",
    "authentic appliances",
    "warranty check",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "JEE",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-background text-foreground`}
      >
        <StoreProvider>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </StoreProvider>
      </body>
    </html>
  );
}
