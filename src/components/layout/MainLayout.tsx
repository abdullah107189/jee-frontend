import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Package, 
  Shield, 
  Phone, 
  CreditCard 
} from 'lucide-react'; 
import { MainLayoutClient } from './MainLayoutClient';

interface MainLayoutProps {
  children: React.ReactNode;
}

// This is a Server Component - SEO friendly
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* Top Banner Notice - Static content, no client interaction needed */}
      <div className="bg-slate-900 text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 flex-wrap">
        <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-extrabold">
          Instant Guarantee
        </span>
        <span>Every product includes digital QR warranty tracking & 70 BDT bKash advance checkout!</span>
      </div>

      {/* Header with Client interactions */}
      <MainLayoutClient />

      {/* Main Body - Children content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer - Static content */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Brand & Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-2xl font-black text-white">
                <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span>TechStore<span className="text-blue-500">.</span></span>
              </div>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                Bangladesh&apos;s premier online & offline electronics ecosystem with verifiable digital QR warranty tracking and instant bKash advance checkout.
              </p>
              <div className="pt-2 text-xs font-semibold text-slate-400 flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-400" /> Helpline: +880 9612-345678
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-extrabold text-base mb-4 tracking-tight">Quick Navigation</h4>
              <ul className="space-y-2.5 text-sm font-semibold text-slate-400">
                <li><Link href="/" className="hover:text-white transition-colors">Home Page</Link></li>
                <li><Link href="/products" className="hover:text-white transition-colors">Browse Products</Link></li>
                <li><Link href="/warranty" className="hover:text-white transition-colors">Check Product Warranty</Link></li>
                <li><Link href="/customer/orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
                <li><Link href="/customer/warranties" className="hover:text-white transition-colors">Warranty Management</Link></li>
              </ul>
            </div>

            {/* Warranty System Info */}
            <div>
              <h4 className="text-white font-extrabold text-base mb-4 tracking-tight">Warranty System</h4>
              <ul className="space-y-2.5 text-sm font-semibold text-slate-400">
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" /> Digital QR Code Activated
                </li>
                <li className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-400" /> Offline & Online Purchases
                </li>
                <li className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-amber-400" /> 70 BDT Advance bKash Option
                </li>
              </ul>
            </div>

            {/* Payment & Security */}
            <div className="space-y-4">
              <h4 className="text-white font-extrabold text-base mb-2 tracking-tight">Accepted Payments</h4>
              <div className="flex flex-wrap gap-2 text-xs font-extrabold">
                <span className="px-3 py-1.5 rounded-lg bg-pink-600/20 text-pink-400 border border-pink-500/30">bKash</span>
                <span className="px-3 py-1.5 rounded-lg bg-orange-600/20 text-orange-400 border border-orange-500/30">Nagad</span>
                <span className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">Visa / Mastercard</span>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">Cash on Delivery</span>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs font-semibold text-slate-500">
            &copy; {new Date().getFullYear()} TechStore. All rights reserved. E-commerce + Offline Seller + Warranty System.
          </div>
        </div>
      </footer>
    </div>
  );
}