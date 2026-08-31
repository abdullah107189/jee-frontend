import type { ReactNode } from 'react';
import { StoreProvider } from './StoreProvider';
import { Toaster } from 'sonner';
import './globals.css';
import { Space_Grotesk, Inter } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <StoreProvider>
          {children}
          <Toaster position="bottom-right" richColors />
        </StoreProvider>
      </body>
    </html>
  );
}