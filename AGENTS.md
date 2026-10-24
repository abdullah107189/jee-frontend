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


## কাজের নিয়ম
- কাজ main এ। নিজে branch বানাবে না, commit বা push করবে না (user করবে)।
- প্রতি session এর শুরুতে AGENTS.md ও docs/PROGRESS.md পড়ো। git status ফাঁকা না থাকলে থেমে জানাও।
- কাজ শেষে PROGRESS.md আপডেট করো: লাইন টিক, প্রমাণ (ফাইল + build/test ফল), Done log এ এক লাইন, "এখন কোন কাজ চলছে" বদলাও। ফাইল ১২০ লাইনের মধ্যে রাখো।
- নতুন কাজ শুরুর আগে বর্তমান milestone এর প্রথম TODO নাও।
- কাজ শুরুর আগে কোন ফাইলে কী বদলাবে তার তালিকা দিয়ে অনুমতি নাও। scope এর বাইরে হাত দেবে না।
- Build/test ফেল করলে architecture বদলে সমাধান করবে না, কারণ রিপোর্ট করে থামবে।
- git checkout -- . / reset --hard / clean জিজ্ঞেস না করে চালাবে না।
- শুধু Next.js App Router (পেজ src/app/**/page.tsx Server Component, UI src/components/modules/**)। src/pages, _app.tsx, Vite ফাইল কখনো বানাবে না। Auth/role চেক সরাবে না।


