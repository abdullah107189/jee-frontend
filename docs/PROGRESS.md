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
- [x] ডেডিকেটেড Homepage Manager রাউট (`/admin/homepage`): হিরো ব্যানার স্লাইডার (ইমেজ, টেক্সট, লিংক), সাইড ব্যানার, ট্রাস্ট ব্যাজ স্ট্রিপ, ও সেকশন টাইটেল অ্যাডমিন কর্তৃক নিয়ন্ত্রণ — DONE
- [x] Products টেবিল (`/admin/products`)-এ লাইভ Featured কলাম ও ১-ক্লিক টগল: অ্যাডমিন সরাসরি দেখতে পারবেন কোন কোন প্রোডাক্ট ওয়েবসাইটে ফিচারড আছে এবং সর্বোচ্চ ৮টি সীমা বজায় রেখে ১-ক্লিকে ফিচারড বা আনফিচারড করতে পারবেন — DONE
### M7 Global Fluid Typography System (সম্পূর্ণ সম্পন্ন ✅)
- [x] CSS Custom Properties ও mathematical `clamp()` ভিত্তিক গ্লোবাল টাইপোগ্রাফি স্কেল তৈরি (`--text-display`, `--text-h1`, `--text-h2`, `--text-h3`, `--text-h4`, `--text-body-lg`, `--text-body`, `--text-body-sm`, `--text-caption`, `--text-badge`) — DONE
- [x] ইউনিফাইড ক্লাস সিস্টেম: `.page-header-title`, `.page-header-desc`, `.section-title`, `.section-description`, `.typo-price`, `.typo-badge`, `.typo-lead`, `.typo-caption` — DONE
- [x] সম্পূর্ণ প্রজেক্টের ৬৩+ টি পেজ ও রিইউজেবল কম্পোনেন্টে টাইপোগ্রাফি প্রয়োগ (Storefront, Cards, Admin, Customer, Seller, Auth, Error Boundaries) — DONE
- [x] Mobile (320px–480px), Tablet (768px–1024px) ও Desktop (1280px+) এ ফ্লুইড স্কেলিং ও কাট-অফ/ওভারফ্লো মুক্ত বাস্তব টেস্ট — DONE
- [x] 60-30-10 কালার ব্যালান্স ও স্পেসিং লেআউট অক্ষুণ্ণ রেখে হার্ডকোডেড সাইজ এবং ডিসক্রিপেন্সি মুক্তকরণ — DONE
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
  2. `Project-Wide Typography Audit & Global Fluid Scale Standardization`:
     - `src/app/globals.css`: গ্লোবাল CSS ভেরিয়েবল এবং ম্যাথমেটিকাল `clamp()` দিয়ে fluid typography scale এবং ইউনিফাইড রিয়ুজেবল টাইপোগ্রাফি ইউটিলিটি ক্লাস ডিফাইন।
     - ৬৩টি ফাইল অডিট ও আপডেট (সব পেজ এবং কম্পোনেন্টের হেডিং, সাব-টাইটেল, কার্ড টাইটেল, প্রাইসিং ও ব্যাজ সুষম)।
     - TypeScript `tsc --noEmit` পাস (Exit code 0)।
- 2026-11-08:
  1. `Protected Route & Post-Login Redirection Fix`:
     - `src/middleware.ts` তৈরি ও `proxy.ts` এর সাথে কানেক্ট করে প্রটেক্টেড রাউটগুলোতে (`/customer/*`, `/admin/*`, `/seller/*`) আনঅথেনটিকেটেড অ্যাক্সেসে ফুল URL ও কুয়েরি প্যারামিটার সহ `/login?redirect=...` এ রিডাইরেক্ট নিশ্চিতকরণ।
     - `src/components/modules/auth/login/login-form.tsx`: `getValidRedirectPath` ইমপ্লিমেন্ট করা হয়েছে যাতে লগইন সফল হওয়ার পর ইউজারকে ঠিক আগের গন্তব্যে (যেমন `/checkout`, `/customer/orders` ইত্যাদি) ফেরত নিয়ে যায়।
     - ওপেন-রিডাইরেক্ট এটাক রোধ এবং রোল-ভিত্তিক অ্যাক্সেস কন্ট্রোল (কাস্টমার যেন অ্যাডমিন/সেলার ড্যাশবোর্ডে রিডাইরেক্ট না হয়) নিশ্চিতকরণ।
     - `src/app/(auth)/login/page.tsx` ও `DashboardLayout.tsx`: অলরেডি লগইন থাকা অবস্থায় বা সার্ভার লেআউটে রিডাইরেক্ট হ্যান্ডলিং ফিক্স।
  2. `Product Card Direct Buy Now Checkout Action`:
     - `src/components/shared/productCard/MainProductCard.tsx`: প্রোডাক্ট কার্ডের "Buy Now" বাটন সরাসরি আইটেম কার্টে অ্যাড করে চেকআউট পেজে (`/checkout`) রিডাইরেক্ট করার লজিক যুক্ত (যেমনটি প্রোডাক্ট ডিটেইলস পেজে রয়েছে)। অলরেডি কার্টে থাকলে ইউজারকে নোটিফাই করে সরাসরি চেকআউটে নিয়ে যাবে।
