# Jee.store PROGRESS (agent আপডেট রাখবে)
শেষ আপডেট: 2026-11-02 | Repo: frontend

## এখন কোন কাজ চলছে
- M4 Admin: Global Product Items (/admin/items) ও Analytics/Settings Real API

## নিয়ম
DONE = build পাস + প্রমাণ | PARTIAL = কী বাকি লেখো | TODO | UNVERIFIED

## Milestones
### M0 স্থিতিশীল করা
- [x] পুরনো feature branch main এ merge, build/test পাস — DONE (main branch, bun run build পাস, ৩৯টি রুট জেনারেটেড)
- [x] AGENTS.md নিয়ম আছে — DONE (AGENTS.md আপডেট সম্পন্ন)
### M1 অনলাইন অর্ডার (COD) end-to-end
- [x] backend: order -> বৈধ status ধাপ -> DELIVERED -> item SOLD + warranty (টেস্টসহ) — অন্য repo
- [x] frontend: admin status dropdown (বৈধ ধাপ, RETURNED, confirm dialog) — DONE (`src/components/modules/admin/orders/admin-order-details.tsx`, `src/actions/order.actions.ts`)
- [x] frontend: customer order list/details real API; Cancel শুধু PENDING — DONE (`src/services/order.service.ts`, `src/components/modules/customer/orders/OrdersList.tsx`, `src/components/modules/customer/orders/details/OrderDetails.tsx`, Cancel action `src/actions/order.actions.ts`)
### M2 Public warranty check
- [x] backend: GET /warranties/check/:serial — অন্য repo (backend এ টেস্টসহ সম্পন্ন)
- [x] frontend: /warranty real API (mock বাদ) — DONE (`src/services/warranty.service.ts`, `src/actions/warranty.actions.ts`, `src/app/(public)/warranty/page.tsx`, bun run build পাস)
### M3 Seller
- [x] seller নতুন বিক্রি UI, বিক্রির ইতিহাস, নিজের warranty তালিকা — DONE (`src/services/seller.service.ts` real API, POS serial verification, offline sale creation, printable receipt `src/components/modules/seller/sales/SaleDetailsContent.tsx`, warranty details `src/app/(dashboard)/seller/warranties/[id]/page.tsx`, bun run build পাস)
- [ ] সিদ্ধান্ত: seller account কে বানাবে (খোলা প্রশ্ন) — TODO
- [x] admin দিয়ে seller approve; seller এর serial দিয়ে item খোঁজার endpoint — DONE (`src/services/admin.service.ts`, `src/actions/admin.actions.ts`, `PendingSellersContent.tsx`, `SellersContent.tsx`)
### M4 Admin
- [x] orders, sellers, pending sellers, users: mock বাদ, real API — DONE (`src/services/admin.service.ts`, `src/actions/admin.actions.ts`)
- [x] warranties & claims desk: mock বাদ, real API — DONE (`AdminWarrantiesContent.tsx`, `WarrantyClaimsContent.tsx`)
- [x] brands: full CRUD, Add/Edit modal, real delete — DONE (`src/actions/brand.actions.ts`, `BrandsContent.tsx`)
- [x] product variant create & edit (Dual image: URL + File Upload) — DONE (`VariantEditContent.tsx`, `VariantAddContent.tsx`)
- [x] Admin Dashboard Overview (`/admin`) real dynamic stats — DONE (`src/app/(dashboard)/admin/page.tsx`)
- [x] Audit Logs (`/admin/audit-logs`) real API integration — DONE (`src/services/admin.service.ts`, backend `audit-log.type.ts`)
- [ ] Global Product Items (`/admin/items`) real inventory search — TODO
- [ ] Analytics (`/admin/analytics`) real insights/charts — TODO
- [ ] System Settings (`/admin/settings`) persistence — TODO
- [ ] product create/edit (ক্লাউড ইমেজ আপলোড S3/Cloudinary) — PARTIAL (URL + Local Upload সম্পন্ন)
### M5 Customer dashboard
- [ ] orders, warranties, profile real API (mock বাদ) — PARTIAL (orders DONE; warranties ও profile `src/services/customer.service.ts` এ mock বাকি)
### M6 লঞ্চের আগে
- [ ] seed admin, env নথি, CORS/helmet/rate limit — অন্য repo
- [ ] 5K-10K কনকারেন্ট ট্রাফিক লোড টেস্টিং, রেট-লিমিট ও সিকিউরিটি টেস্ট — TODO
- [x] অনেকক্ষণ PENDING অর্ডার (MVP: admin হাতে cancel) — DONE (`src/components/modules/admin/orders/admin-order-details.tsx` থেকে admin cancel করতে পারে)
- [ ] deploy, migrate deploy, DB backup — TODO

## MVP এর পরে
ডেলিভারির পরের return/refund, warranty claim, notification, review, banner/settings,
SSLCommerz, Redis caching layer, load balancer

## সিদ্ধান্ত
- MVP: COD only; Payment মডেল ভবিষ্যতের জন্য, ব্যবহার হয় না
- RETURNED = ডেলিভারি ব্যর্থ (SHIPPED থেকে)
- sale/warranty মোছা যায় না (void/return পরে)
- Frontend: শুধু App Router, src/pages নয়
- কাজ main এ, user নিজে commit করে
- ডাটাবেস স্কিমা কোড অপরিবর্তিত থাকবে; ৫,০০০-১০,০০০ কনকারেন্ট ইউজার এবং হ্যাকিং প্রতিরোধে কঠোর ভ্যালিডেশন বজায় থাকবে

## খোলা প্রশ্ন
## Done log
- 2026-11-02: Admin Dashboard Overview (`/admin`) রিয়েল সমান্তরাল ডাটা ফেচিং এবং System Audit Logs (`/admin/audit-logs`) রিয়েল ব্যাকএন্ড API ইন্টিগ্রেশন সম্পন্ন (tsc/lint পাস: 0 errors)
- 2026-11-02: Admin Brand Management সম্পূর্ণ রিয়েল API CRUD ইন্টিগ্রেশন সম্পন্ন (Add Brand Modal, Edit Brand Modal, Real Delete Action, Server Actions `createBrandAction`/`updateBrandAction`/`deleteBrandAction`, backend `PATCH /brands/:id` ও `DELETE /brands/:id` routes; frontend lint ও backend build পাস: 0 errors)
- 2026-11-02: Admin All Warranties (`/admin/warranties`) এবং Claims & Servicing Desk (`/admin/warranties/claims`) এর mock বাদ দিয়ে রিয়েল API (`/warranties`, `/warranty-claims`, `PATCH /warranties/:id`, `PATCH /warranty-claims/:id`) সম্পূর্ণ ডায়নামিক ও স্ট্যাটাস আপডেট ইন্টিগ্রেশন সম্পন্ন (frontend lint ও backend build পাস: 0 errors)
- 2026-11-02: Admin Product/Variant/Category তৈরি, আপডেট, ডিলিট বা ইনভেন্টরি আইটেম যোগের পর Public Storefront ও Admin-এ Instant On-Demand Cache Invalidation চালু (`revalidateTag("products", "max")`, `revalidateTag("categories", "max")`, `revalidateTag("product:${slug}", "max")`, `revalidatePath("/", "layout")`, `revalidatePath("/products")`; frontend bun run lint পাস: 0 errors)
- 2026-11-02: Admin Product Variant Edit ও Add এ Dual Image Support (Direct URL paste + Local file upload FileReader Data-URL) এবং ব্যাকএন্ড ProductVariant Update লজিক ও SKU সিঙ্ক সম্পন্ন (frontend ও backend build/lint পাস: 0 errors)
- 2026-11-02: Admin Sellers, Pending Sellers Approvals, এবং Users Management এর mock বাদ দিয়ে রিয়েল API (`/sellers`, `/users`, `PATCH /sellers/:id`, `PATCH /users/:id`) এবং Next.js Server Actions ইন্টিগ্রেশন সম্পন্ন (tsc --noEmit পাস: 0 errors)
- 2026-10-26: Seller POS ব্যাচ সেল রেসপন্স ও টোস্ট ফিক্স (একক কনসোলিডেটেড টোস্ট, Sonner স্ট্যান্ডার্ড), সেল হিস্ট্রি পেজ ক্র্যাশ ফিক্স (price ও status সেফটি) এবং মোবাইল-ফার্স্ট কার্ড ভিউ সম্পন্ন (bun run build পাস: ৩৯ রুট জেনারেটেড)
- 2026-10-26: Seller POS এ ডুপ্লিকেট স্ক্যান রোধ (Set ref + ক্যামেরা ডিবাইন্স), ব্যাকএন্ড ইউনিট প্রাইস ক্যালকুলেশন ফিক্স, এবং ফুল মোবাইল-ফার্স্ট কার্ড ভিউ ও টাচ-ফ্রেন্ডলি UI সম্পন্ন (bun run build পাস)
- 2026-10-26: Seller POS এ বহু-আইটেম (Multi-item) ব্যাচ সেল, ক্যামেরা চালু রেখে কন্টিনিউয়াস স্ক্যান ও অডিও বিপ সাউন্ড, ঐচ্ছিক কাস্টমার ইনফো (ডিফল্ট Walk-in Customer) এবং প্রিন্টেবল ক্যাশ মেমো রিসিট সম্পন্ন (bun run build পাস)
- 2026-10-26: Seller ড্যাশবোর্ড real API ইন্টিগ্রেশন সম্পন্ন (POS অফলাইন সেল ও সিরিয়াল ভ্যালিডেশন, সেল হিস্ট্রি ও প্রিন্টেবল ইনভয়েস/রিসিপ্ট, ওয়ারেন্টি রেজিস্ট্রি ও ডিটেইলস, সেলার প্রোফাইল ও পাসওয়ার্ড আপডেট; bun run build পাস: ৩৯ রুট জেনারেটেড)
- 2026-10-25: ওয়ারেন্টি ট্র্যাকার সম্পূর্ণ ইংরেজিতে রূপান্তর, ইন-স্টক আইটেম ব্যাকএন্ড লুকআপ ফিক্স (ReferenceError ও case-insensitive সমাধান), এবং ১-ক্লিক সিরিয়াল কপি ও ফুল প্রডাক্ট ইনফো UI সম্পন্ন (bun run build পাস, backend Case k পাস)
- 2026-10-25: মোবাইল ও ডেস্কটপে প্রিমিয়াম ShadCN নেভবার, সরাসরি মোবাইল সার্চ ও ১-ট্যাপ ক্যামেরা স্ক্যান বাটন, স্ক্রোলেবল ক্যাটাগরি পিলস এবং Sheet ক্যাটাগরি ড্রয়ার সম্পন্ন (bun run build পাস, ৩৯ রুট জেনারেটেড)
- 2026-10-25: প্রডাক্ট আইটেম সেভের পর অটো QR স্টিকার জেনারেশন ও প্রিন্ট ডায়ালগ (QrStickerModal, box packaging label, single ও batch print) এবং JEE backend AGENTS.md এ strict validation রুল সংযোজন সম্পন্ন (bun run build পাস, ৩৯ রুট জেনারেটেড)
- 2026-10-25: Multi-courier (Steadfast, Pathao, Sundarban) ট্র্যাকিং ও PROCESSING এ QR/সিরিয়াল অ্যাসাইন ডায়ালগ এবং README.md ডকুমেন্টেশন সম্পন্ন (bun run build পাস, ৩৯ রুট জেনারেটেড)
- 2026-10-24: Customer order details এ item serial number, copy বাটন ও সরাসরি /warranty?serial=... গভীর লিংক এবং auto-lookup সম্পন্ন (bun run build পাস, ৩৯ রুট জেনারেটেড)
- 2026-10-24: Public warranty check /warranty real API ইন্টিগ্রেশন সম্পন্ন (mock বাদ, bun run build পাস)
- 2026-10-24: Admin order status transitions (CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED) ও confirm dialog সম্পন্ন (commit e8bdc9d, 1a1581d)
- 2026-10-24: Customer order list, details ও cancel order real API সম্পন্ন
- 2026-10-24: Admin variant create (`/admin/products/[id]/variants/new`) ও edit (`/admin/products/[id]/variants/[variantId]/edit`) real API সম্পন্ন
- 2026-10-24: Frontend build পাস (bun run build: ৩৯ রুট জেনারেটেড)
