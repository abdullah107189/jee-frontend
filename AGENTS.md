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


## ফ্রন্টএন্ড নিয়ম
- শুধু Next.js App Router। পেজ: src/app/**/page.tsx (Server Component)। UI: src/components/modules/**।
  src/pages, _app.tsx, Vite ফাইল কখনো বানাবে না।
- Build ফেল করলে architecture বদলাবে না, কারণ রিপোর্ট করে থামবে।
- git checkout -- . / reset --hard / clean: জিজ্ঞেস না করে চালাবে না।
- Auth/role চেক সরাবে না। scope এর বাইরের ফাইলে হাত দেবে না।