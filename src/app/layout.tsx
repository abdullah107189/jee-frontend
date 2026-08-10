import type { ReactNode } from 'react';
import { StoreProvider } from './StoreProvider';
import { Toaster } from 'sonner';
import './globals.css';

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