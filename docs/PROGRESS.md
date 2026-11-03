# Jee.store PROGRESS (agent আপডেট রাখবে)
শেষ আপডেট: 2026-11-03 | Repo: frontend & backend

## এখন কোন কাজ চলছে
- Featured Products স্লাইডার (Apple Gadgets স্টাইল টপ-রাইট অ্যারো, সর্বোচ্চ ৮ প্রোডাক্ট লিমিট, অ্যাডমিন সেটিংস ভ্যালিডেশন) এবং প্রিমিয়াম ফুটার রিডিজাইন সম্পন্ন!

## নিয়ম
DONE = build পাস + প্রমাণ | PARTIAL = কী বাকি লেখো | TODO | UNVERIFIED

## Milestones
### M0 স্থিতিশীল করা
- [x] পুরনো feature branch main এ merge, build/test পাস — DONE
- [x] AGENTS.md নিয়ম, 5K-10K স্কেল, 60-30-10 কালার ও Day-first Date Format গাইডলাইনস আছে — DONE
- [x] ডার্ক/লাইট মোড (Shadcn ThemeProvider + 1-Click Navbar Toggle + Zero FOUC) — DONE
- [x] অ্যাডমিন, সেলার ও স্টোরফ্রন্ট কালার রিফ্যাক্টরিং (হার্ডকোডেড text-slate-900/500 মুক্ত) — DONE
- [x] ডাইনামিক রোল-ভিত্তিক প্রোফাইল ড্রপডাউন (Admin/Seller/Customer) — DONE
### M1 অনলাইন অর্ডার (COD) end-to-end
- [x] backend: order -> বৈধ status ধাপ -> DELIVERED -> item SOLD + warranty — DONE
- [x] frontend: admin status dropdown (বৈধ ধাপ, RETURNED, confirm dialog) — DONE
- [x] frontend: customer order list/details real API; Cancel শুধু PENDING — DONE
- [x] frontend: Cart ➔ Checkout ➔ Order Placement (সেভড অ্যাড্রেস অটো-ফিল, রিয়েল API) — DONE
### M2 Public warranty check
- [x] backend: GET /warranties/check/:serial (রিয়েল ইমেজ, ব্র্যান্ড, ক্যাটাগরি, ম্যানুফ্যাকচার ডেট সহ) — DONE
- [x] frontend: /warranty রিয়েল API, লাইভ কালেকশন কাউন্টডাউন, টু-কলাম রেসপনসিভ UI ও সার্টিফাইড সিল — DONE
- [x] frontend: Homepage Hero Section "Check Warranty" উইজেট ক্যামেরা QR স্ক্যানার সহ — DONE
### M3 Seller
- [x] seller নতুন বিক্রি UI, বিক্রির ইতিহাস, নিজের warranty তালিকা — DONE
- [x] admin দিয়ে seller approve; seller এর serial দিয়ে item খোঁজার endpoint — DONE
### M4 Admin (সম্পূর্ণ সম্পন্ন ✅)
- [x] orders, sellers, pending sellers, users: real API — DONE
- [x] warranties & claims desk: real API & technician update — DONE
- [x] brands: full CRUD, Add/Edit modal, real delete — DONE
- [x] product variant create & edit (Dual image: URL + File Upload) — DONE
- [x] Admin Dashboard Overview (`/admin`) real stats — DONE
- [x] Audit Logs (`/admin/audit-logs`) real tracking & working fix — DONE
- [x] Product Variant Production Batches (`/admin/products/[id]/variants/[variantId]`) — DONE
- [x] Global Date Format Hard Rule (Day first: DD MMM YYYY / DD/MM/YYYY) — DONE
- [x] Analytics (`/admin/analytics`) real insights/charts — DONE
- [x] System Settings (`/admin/settings`) persistence & DB snapshot backup — DONE
- [x] Homepage Featured Showcase অ্যাডমিন ম্যানেজমেন্ট (`/admin/settings` -> Featured Showcase tab) সর্বোচ্চ ৮ টি প্রোডাক্টের সীমা সহ — DONE
### M5 Customer dashboard (সম্পূর্ণ সম্পন্ন ✅)
- [x] orders, warranties, profile, claims: real API (mock data সম্পূর্ণ অপসারিত) — DONE
- [x] কাস্টমার ড্যাশবোর্ড ডেডিকেটেড ওয়ারেন্টি ভেরিফিকেশন পেজ (`/customer/warranties/check`) — ড্যাশবোর্ড থেকে বের না হয়ে চেক — DONE
- [x] লাইভ কাউন্টডাউন টাইমার (দিন, ঘণ্টা, মিনিট, সেকেন্ড), প্রগ্রেস মিটার ও রিয়েল ইমেজ ডিসপ্লে — DONE
- [x] ডে-ফার্স্ট ডেট ফরম্যাটিং স্ট্যান্ডার্ড (`formatAppDate`, `formatAppDateTime`) সর্বত্র প্রযোজ্য — DONE
### M6 স্টোরফ্রন্ট ও হোমপেজ UI আপগ্রেড (Apple Gadgets BD স্টাইল)
- [x] হোমপেজ ট্যাবলেট ও মোবাইল রেসপনসিভনেস (TrustBadges, Categories, Featured & Latest Products) — DONE
- [x] Featured Products ক্যারোসেল স্লাইডার: টপ-রাইট `<` `>` অ্যারো বাটন, টাচ সোয়াইপ স্ন্যাপ, ডেনসিটি (ডেস্কটপ ৫, ল্যাপটপ ৪, ট্যাবলেট ৩, মোবাইল ২) — DONE
- [x] Featured Products ডিবি থেকে সর্বোচ্চ ৮ টি আইটেম ফেচ এবং অ্যাডমিন কর্তৃক ৮ টির বেশি যোগ করা রোধের পূর্ণ ভ্যালিডেশন — DONE
- [x] Apple Gadgets BD আদলে প্রিমিয়াম ফুটার রিডিজাইন: হটলাইন কার্ড (+880 9612-345678), শোরুম ঠিকানা, ইমেইল সাপোর্ট, কাস্টমার কেয়ার লিংক, এক্সপ্লোর লিংক, সোশ্যাল কানেক্টিভিটি এবং পেমেন্ট মেথড ব্যাজ (বিকাশ, নগদ, রকেট, ভিসা/মাস্টারকার্ড, ক্যাশ অন ডেলিভারি) — DONE
- [ ] 5K-10K কনকারেন্ট ট্রাফিক লোড টেস্টিং, রেট-লিমিট ও সিকিউরিটি টেস্ট — TODO (পরে করা হবে)
- [x] অনেকক্ষণ PENDING অর্ডার (MVP: admin হাতে cancel) — DONE
- [ ] deploy, migrate deploy, DB backup — TODO

## Done log
- 2026-11-03:
  1. `Storefront Responsiveness (Mobile + Tablet)`:
     - `TrustBadges`: মোবাইলে আইকন ও টেক্সট কমপ্যাক্ট স্কেলিং (`p-2.5 sm:p-3.5 lg:p-4`), টেক্সট ট্রাঙ্কেশন ও সুষম গ্রিড যাতে ছোট ফোনে লেখা না ভাঙে।
     - `CategoriesSection`: কনটেইনার প্যাডিং `px-4 sm:px-6 lg:px-8` এ সমন্বয়, হেডারের ফন্ট স্কেলিং ও ট্যাবলেটে ৫টি ক্যাটাগরির সুষম সিঙ্গেল রো (`sm:grid-cols-5`)।
     - `FeaturedProducts`: ট্যাবলেটের জন্য `sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5` গ্রিড তৈরি, যাতে ট্যাবলেটে অপ্রয়োজনীয় বড় ২ কলাম না থাকে।
     - `ProductCard` & `HorizontalProductCard`: মোবাইলের জন্য অপ্টিমাইজড ইমেজ সাইজ, টেক্সট ক্ল্যাম্প ও টাচ বাটন।
     - `AGENTS.md`: Storefront Mobile & Tablet Responsiveness Standard রুল যুক্ত।
