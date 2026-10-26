# AGENTS.md — JEE Frontend

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript strict
- Tailwind CSS v4
- ShadCN UI
- Redux Toolkit (cart only)
- Sonner (toasts)
- Lucide-react (icons)
- React Hook Form + Zod
- Bun runtime

## Hard Rules

### Framework
- **App Router only** — no Pages Router
- Server Components by default
- `"use client"` only when interactivity needed

### Auth & Session
- Middleware: **`proxy.ts`** at `src/` root (NOT `middleware.ts`)
- Auto-refresh access token at browser request layer
- `lib/auth/session.ts` → `auth()`, `requireAuth()`, `requireRole()` (server-only)
- `lib/auth/role.ts` → `roleDashboard()` (client-safe)
- Role redirect: **lowercase** — `/admin`, `/seller`, `/customer`
- Use `roleDashboard(user.role)` for redirects

### Service Architecture
- **NO mock/dummy data** — always real `${API_URL}` fetch
- Server Components → direct `fetch` with cookie forward
- Client mutations → Server Actions (`actions/`)
- `services/` folder — server-only (`import "server-only"` top)

### Forms
- React Hook Form + Zod resolver
- ShadCN `Form`, `FormField`, `FormControl`, `FormMessage`
- Server Actions for submit

### Redux
- **Cart only** — no other Redux state
- Persist via `redux-persist`
- `store/slices/cartSlice.ts`

### Tailwind v4
- CSS-first config in `globals.css` via `@theme`
- NO `tailwind.config.js`

## Structure
```
src/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   └── (dashboard)/{admin,customer,seller}/
├── components/
│   ├── layout/
│   ├── modules/{feature}/
│   └── ui/
├── actions/
├── services/
├── lib/
│   ├── auth/
│   ├── types/
│   └── utils.ts
├── hooks/
├── store/
└── proxy.ts
```

## Do NOT
- ❌ `middleware.ts` — use `proxy.ts`
- ❌ Uppercase role paths
- ❌ Redux for non-cart state
- ❌ `next/headers` in Client Components
- ❌ `useState`/`useEffect` in Server Components
- ❌ Mock data
- ❌ `any` types


## Performance & Scalability (5K+ Concurrent Users)
- **Fast response & High Throughput:** অপ্টিমাইজড সার্ভার অ্যাকশন এবং হালকা ক্লায়েন্ট বান্ডেল যাতে ৫,০০০ ইউজার একসাথে কোনো ল্যাগ ছাড়া সহজে সাইট ব্যবহার করতে পারে।
- **Server-first & Cache Optimization:** অপ্রয়োজনীয় ডাটাবেস ফেচ পরিহার করো, ক্যাশিং ও সঠিক ট্যাগ ব্যবহার করো।
- **Lean Payloads:** অপ্রয়োজনীয় ভারি ফিল্ড বাদ দিয়ে শুধুমাত্র প্রয়োজনীয় ফিল্ড ফেচ ও সিলেক্ট করো।
- **No Schema Changes:** কোনো অবস্থাতেই ডাটাবেস স্কিমা কোড বদলাবে না; বিদ্যমান স্কিমার সাথে শতভাগ সামঞ্জস্য রেখে কাজ করো।

## Security & Anti-Hacking Hardening
- **Strict Validation:** ফ্রন্টএন্ড এবং ব্যাকএন্ড উভয়েই স্কিমার সাথে ইনপুট নিখুঁতভাবে ভ্যালিডেট করো।
- **Zero-trust Mutations:** ক্লায়েন্ট ডাটাকে কখনো বিশ্বাস করবে না; সার্ভারে দাম/স্টক/রোল কঠোরভাবে পরীক্ষা করো।
- **Role & Auth Defense:** প্রতিটি সার্ভার অ্যাকশনে `requireRole` ও `auth()` প্রয়োগ করো; হ্যাকিং ও অননুমোদিত অ্যাক্সেস প্রতিরোধ করো।
- **Never Log Secrets:** পাসওয়ার্ড, টোকেন বা ওটিপি কখনো কনসোল বা লগে প্রিন্ট করবে না।

## কাজের নিয়ম
- কাজ main এ। নিজে branch বানাবে না, commit বা push করবে না (user করবে)।
- প্রতি session এর শুরুতে AGENTS.md ও docs/PROGRESS.md পড়ো। git status ফাঁকা না থাকলে থেমে জানাও।
- কাজ শেষে PROGRESS.md আপডেট করো: লাইন টিক, প্রমাণ (ফাইল + build/test ফল), Done log এ এক লাইন, "এখন কোন কাজ চলছে" বদলাও। ফাইল ১২০ লাইনের মধ্যে রাখো।
- নতুন কাজ শুরুর আগে বর্তমান milestone এর প্রথম TODO নাও।
- কাজ শুরুর আগে কোন ফাইলে কী বদলাবে তার তালিকা দিয়ে অনুমতি নাও। scope এর বাইরে হাত দেবে না।
- Build/test ফেল করলে architecture বদলে সমাধান করবে না, কারণ রিপোর্ট করে থামবে।
- git checkout -- . / reset --hard / clean জিজ্ঞেস না করে চালাবে না।
- শুধু Next.js App Router (পেজ src/app/**/page.tsx Server Component, UI src/components/modules/**)। src/pages, _app.tsx, Vite ফাইল কখনো বানাবে না। Auth/role চেক সরাবে না।
- **Backend Route Verification:** কখনো অনুমান করে কোনো API রুট বা পেলোড লিখবে না। ব্যাকএন্ডের `src/routes/index.ts`, সংশ্লিষ্ট মডিউল রাউট ফাইল এবং কন্ট্রোলার/ভ্যালিডেশন কোড দেখে শতভাগ নিশ্চিত হয়ে তবেই ফ্রন্টএন্ড সার্ভিস/অ্যাকশনে কল করবে।


