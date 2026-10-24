# Jee.store PROGRESS (agent আপডেট রাখবে)
শেষ আপডেট: 2026-10-24 | Repo: frontend

## এখন কোন কাজ চলছে
- M2: /warranty real API ইন্টিগ্রেশন (mock ডাটা সরানো)

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
- [ ] backend: GET /warranties/check/:serial — অন্য repo
- [ ] frontend: /warranty real API (mock বাদ) — TODO (`src/services/warranty.service.ts` এ mock রয়েছে, real API কল বাকি)
### M3 Seller
- [ ] সিদ্ধান্ত: seller account কে বানাবে (খোলা প্রশ্ন) — TODO
- [ ] admin দিয়ে seller approve; seller এর serial দিয়ে item খোঁজার endpoint — অন্য repo
- [ ] seller নতুন বিক্রি UI, বিক্রির ইতিহাস, নিজের warranty তালিকা — PARTIAL (UI পেজ `/seller/sales` আছে, `src/services/seller.service.ts` এ real API বাকি)
### M4 Admin
- [ ] product create/edit (ছবি আপলোডসহ) — PARTIAL (`/admin/products/new`, `[id]/edit`, `[id]/variants/new`, `[id]/variants/[variantId]/edit` real API সম্পন্ন, ক্লাউড ইমেজ আপলোড বাকি)
- [ ] orders, sellers, pending sellers, users: mock বাদ, real API — PARTIAL (orders DONE; sellers, pending sellers, users `src/services/admin.service.ts` এ mock বাকি)
### M5 Customer dashboard
- [ ] orders, warranties, profile real API (mock বাদ) — PARTIAL (orders DONE; warranties ও profile `src/services/customer.service.ts` এ mock বাকি)
### M6 লঞ্চের আগে
- [ ] seed admin, env নথি, CORS/helmet/rate limit — অন্য repo
- [x] অনেকক্ষণ PENDING অর্ডার (MVP: admin হাতে cancel) — DONE (`src/components/modules/admin/orders/admin-order-details.tsx` থেকে admin cancel করতে পারে)
- [ ] deploy, migrate deploy, DB backup — TODO

## MVP এর পরে
ডেলিভারির পরের return/refund, warranty claim, notification, review, banner/settings,
SSLCommerz, analytics, audit log UI

## সিদ্ধান্ত
- MVP: COD only; Payment মডেল ভবিষ্যতের জন্য, ব্যবহার হয় না
- RETURNED = ডেলিভারি ব্যর্থ (SHIPPED থেকে)
- sale/warranty মোছা যায় না (void/return পরে)
- Frontend: শুধু App Router, src/pages নয়
- কাজ main এ, user নিজে commit করে

## খোলা প্রশ্ন
- seller account কে বানাবে? (সুপারিশ: admin বানাবে/approve করবে, APPROVED ছাড়া বিক্রি নেই)

## Done log
- 2026-10-24: Admin order status transitions (CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED) ও confirm dialog সম্পন্ন (commit e8bdc9d, 1a1581d)
- 2026-10-24: Customer order list, details ও cancel order real API সম্পন্ন
- 2026-10-24: Admin variant create (`/admin/products/[id]/variants/new`) ও edit (`/admin/products/[id]/variants/[variantId]/edit`) real API সম্পন্ন
- 2026-10-24: Frontend build পাস (bun run build: ৩৯ রুট জেনারেটেড)
