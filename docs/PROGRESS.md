# Jee.store PROGRESS (agent আপডেট রাখবে)
শেষ আপডেট: 2026-11-03 | Repo: frontend & backend

## এখন কোন কাজ চলছে
- M4 Admin: অ্যাডমিন ড্যাশবোর্ড জুড়ে হার্ডকোডেড লাইট কালার সম্পূর্ণ ক্লিনআপ করে সেমান্টিক টোকেন (`bg-card`, `bg-muted`, `text-foreground`, `border-border`) দিয়ে ডার্ক/লাইট মোড পারফেক্ট করা সম্পন্ন।

## নিয়ম
DONE = build পাস + প্রমাণ | PARTIAL = কী বাকি লেখো | TODO | UNVERIFIED

## Milestones
### M0 স্থিতিশীল করা
- [x] পুরনো feature branch main এ merge, build/test পাস — DONE
- [x] AGENTS.md নিয়ম, 5K-10K স্কেল ও Day-first Date Format গাইডলাইনস আছে — DONE
- [x] ডার্ক/লাইট মোড (Shadcn ThemeProvider + 1-Click Navbar Toggle + Zero FOUC) — DONE
- [x] অ্যাডমিন ড্যাশবোর্ড ও লেআউট কালার রিফ্যাক্টরিং (হার্ডকোডেড হোয়াইট/গ্রে মুক্ত) — DONE
### M1 অনলাইন অর্ডার (COD) end-to-end
- [x] backend: order -> বৈধ status ধাপ -> DELIVERED -> item SOLD + warranty — DONE
- [x] frontend: admin status dropdown (বৈধ ধাপ, RETURNED, confirm dialog) — DONE
- [x] frontend: customer order list/details real API; Cancel শুধু PENDING — DONE
### M2 Public warranty check
- [x] backend: GET /warranties/check/:serial — DONE
- [x] frontend: /warranty real API — DONE
### M3 Seller
- [x] seller নতুন বিক্রি UI, বিক্রির ইতিহাস, নিজের warranty তালিকা — DONE
- [x] admin দিয়ে seller approve; seller এর serial দিয়ে item খোঁজার endpoint — DONE
### M4 Admin
- [x] orders, sellers, pending sellers, users: real API — DONE
- [x] warranties & claims desk: real API & technician update — DONE
- [x] brands: full CRUD, Add/Edit modal, real delete — DONE
- [x] product variant create & edit (Dual image: URL + File Upload) — DONE
- [x] Admin Dashboard Overview (`/admin`) real stats — DONE
- [x] Audit Logs (`/admin/audit-logs`) real tracking & working fix — DONE
- [x] Product Variant Production Batches (`/admin/products/[id]/variants/[variantId]`) — DONE
- [x] Global Date Format Hard Rule (Day first: DD MMM YYYY / DD/MM/YYYY) — DONE
- [ ] Analytics (`/admin/analytics`) real insights/charts — TODO
- [ ] System Settings (`/admin/settings`) persistence — TODO (ইউজার পরে করবে)
- [ ] product create/edit (ক্লাউড ইমেজ আপলোড S3/Cloudinary) — PARTIAL (URL + Local Upload সম্পন্ন)
### M5 Customer dashboard
- [ ] orders, warranties, profile real API (mock বাদ) — PARTIAL (orders DONE; profile/warranty বাকি)
### M6 লঞ্চের আগে
- [ ] 5K-10K কনকারেন্ট ট্রাফিক লোড টেস্টিং, রেট-লিমিট ও সিকিউরিটি টেস্ট — TODO
- [x] অনেকক্ষণ PENDING অর্ডার (MVP: admin হাতে cancel) — DONE
- [ ] deploy, migrate deploy, DB backup — TODO

## Done log
- 2026-11-03: ডার্ক/লাইট মোড এবং হার্ডকোডেড কালার ক্লিনআপ সম্পন্ন:
  1. `src/components/theme-provider.tsx`: লাইট, ডার্ক ও সিস্টেম মোড সাপোর্ট, লোকালস্টোরেজ পারসিস্টেন্স ও FOUC প্রিভেনশন স্ক্রিপ্ট।
  2. `src/components/ui/theme-toggle.tsx`: ১-ক্লিক সান/মুন অ্যানিমেটেড টগল।
  3. অ্যাডমিন ড্যাশবোর্ডের সব পেজ (`Analytics`, `Settings`, `Warranties`, `Warranty Claims`, `Products`, `Product Details`, `Product Add/Edit`, `Variant Add/Edit`, `Brands`, `Categories`, `MegaMenu`)-এর সমস্ত হার্ডকোডেড `bg-white`, `bg-slate-50`, `text-slate-900` সরিয়ে সেমান্টিক CSS ভেরিয়েবল টোকেন (`bg-card`, `bg-muted/40`, `text-foreground`, `text-muted-foreground`, `border-border`) প্রতিস্থাপন।
  4. তারিখ ডিসপ্লে সব জায়গায় Day first (`DD MMM YYYY`) ফরম্যাট নিশ্চিত।
  5. `bun run lint` (`tsc --noEmit`) পাস: 0 errors.
