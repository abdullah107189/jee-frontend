# Jee.store PROGRESS (agent আপডেট রাখবে)
শেষ আপডেট: 2026-11-03 | Repo: frontend & backend

## এখন কোন কাজ চলছে
- M5 Customer Dashboard ও Warranty ভেরিফিকেশন সম্পূর্ণ সম্পন্ন! ইন-ড্যাশবোর্ড ওয়ারেন্টি চেক (`/customer/warranties/check`) এবং পাবলিক অথেন্টিসিটি ট্র্যাকার (`/warranty`) লাইভ কাউন্টডাউন ও রিয়েল ইমেজ সহ আপগ্রেডেড। পরবর্তী কাজ: M6 লঞ্চ পূর্ববর্তী প্রস্তুতি ও লোড অপটিমাইজেশন।

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
### M2 Public warranty check
- [x] backend: GET /warranties/check/:serial (রিয়েল ইমেজ, ব্র্যান্ড, ক্যাটাগরি, ম্যানুফ্যাকচার ডেট সহ) — DONE
- [x] frontend: /warranty রিয়েল API, লাইভ কালেকশন কাউন্টডাউন, টু-কলাম রেসপনসিভ UI ও সার্টিফাইড সিল — DONE
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
### M5 Customer dashboard (সম্পূর্ণ সম্পন্ন ✅)
- [x] orders, warranties, profile, claims: real API (mock data সম্পূর্ণ অপসারিত) — DONE
- [x] কাস্টমার ড্যাশবোর্ড ডেডিকেটেড ওয়ারেন্টি ভেরিফিকেশন পেজ (`/customer/warranties/check`) — ড্যাশবোর্ড থেকে বের না হয়ে চেক — DONE
- [x] লাইভ কাউন্টডাউন টাইমার (দিন, ঘণ্টা, মিনিট, সেকেন্ড), প্রগ্রেস মিটার ও রিয়েল ইমেজ ডিসপ্লে — DONE
- [x] ডে-ফার্স্ট ডেট ফরম্যাটিং স্ট্যান্ডার্ড (`formatAppDate`, `formatAppDateTime`) সর্বত্র প্রযোজ্য — DONE
### M6 লঞ্চের আগে
- [ ] 5K-10K কনকারেন্ট ট্রাফিক লোড টেস্টিং, রেট-লিমিট ও সিকিউরিটি টেস্ট — TODO
- [x] অনেকক্ষণ PENDING অর্ডার (MVP: admin হাতে cancel) — DONE
- [ ] deploy, migrate deploy, DB backup — TODO

## Done log
- 2026-11-03:
  1. `Customer Dashboard In-Layout Warranty Check`: `/customer/warranties/check` পেজ তৈরি করা হয়েছে, যাতে কাস্টমার ড্যাশবোর্ড ছেড়ে না গিয়ে সরাসরি সিরিয়াল বা QR কোড স্ক্যান করে লাইভ কাউন্টডাউন সহ ওয়ারেন্টি স্ট্যাটাস দেখতে পারে।
  2. `Public Warranty UI Refactor` (`/warranty`): পিসি, ট্যাবলেট ও মোবাইলের জন্য অত্যাধুনিক ২-কলাম রেসপনসিভ লেআউট, প্রোডাক্টের রিয়েল ইমেজ, ব্র্যান্ড, ক্যাটাগরি, ভ্যারিয়েন্ট স্পেসিফিকেশন ও দিন-ঘণ্টা-মিনিট-সেকেন্ডের লাইভ কাউন্টডাউন টিকিং যুক্ত করা হয়েছে।
  3. `customer.service.ts`: সমস্ত মক ডাটা বাদ দিয়ে ব্যাকএন্ডের রিয়েল API কল সংযুক্ত করা হয়েছে (`/warranties`, `/customers/me`, `/users/me`, `/orders`, `/warranty-claims`)।
  4. `AGENTS.md`: ওয়ারেন্টি নেভিগেশন সেপারেশন ও লাইভ কাউন্টডাউন সম্পর্কিত হার্ড রুল সংরক্ষিত।
