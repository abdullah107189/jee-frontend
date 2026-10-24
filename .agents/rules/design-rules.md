---
trigger: always_on
---

# Design Rules — JEE Store

## 🎯 Philosophy
- Clean, minimal, spacious
- SSR-first
- SEO-friendly
- Mobile-first
- Accessible (WCAG AA)
- JEE brand: deep navy + electric blue

## 🎨 Stack
- Tailwind v4 (already in `globals.css`)
- ShadCN UI
- Inter Variable font
- Lucide icons
- Sonner toast

## 🎨 Color System

### Semantic tokens (STRICT)
| Purpose | Class |
|---|---|
| Background | `bg-background` |
| Card | `bg-card` |
| Muted | `bg-muted` |
| Primary | `bg-primary` / `text-primary` |
| Secondary | `bg-secondary` |
| Accent | `bg-accent` |
| Border | `border-border` |
| Danger | `bg-destructive` |
| Muted text | `text-muted-foreground` |
| Ring | `ring-ring` |

### JEE brand utilities
- `.jee-gradient` — hero / CTA bg
- `.jee-gradient-text` — highlight text
- `.jee-shadow` — elevated cards
- `bg-brand-navy`, `bg-brand-blue`, `bg-brand-sky`, `bg-brand-deep`

❌ **Never raw colors** (`text-blue-500`, `bg-gray-100`)

## 📐 Layout

### Container — `.mxw` (ALWAYS)
```tsx
<main className="mxw">
  <section className="section-padding">
    <h2 className="section-title">Featured</h2>
  </section>
</main>
```

**`.mxw`** = `max-width: 1400px` + auto margin + `padding: 0 15px`

**❌ NEVER** manually `max-w-7xl mx-auto px-*` — use `.mxw`

### Other layout utilities
- `.section-padding` — vertical rhythm
- `.section-title` — heading
- `.section-description` — sub-heading

### Spacing
- Section gap: `space-y-6 sm:space-y-8`
- Card padding: `p-4 sm:p-6 lg:p-8`
- Grid gap: `gap-3 sm:gap-4 lg:gap-6`

### Breakpoints
`sm:` 640 | `md:` 768 | `lg:` 1024 | `xl:` 1280

## 🔤 Typography
| Purpose | Classes |
|---|---|
| Page heading | `text-2xl font-extrabold tracking-tight sm:text-3xl` |
| Section title | `.section-title` |
| Body | `text-sm sm:text-base` |
| Muted | `text-muted-foreground` |
| Mono (SKU) | `font-mono text-xs` |
| Price | `text-lg font-black tabular-nums` |

Numbers এ `tabular-nums`।

## 🧩 Components

### Server Component (default)
### Client Component (interactivity)

### Folder
```
components/
  ui/              ← ShadCN
  shared/          ← Reusable
  modules/
    (public)/
    admin/
    customer/
    seller/
```

## 🖼 ShadCN
- Button: `default`, `outline`, `ghost`, `destructive`
- Card: `rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem]`
- Form: RHF + Zod + `<Form>`
- Badge: `success`, `outline`

## 📱 Responsive
- Grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`
- Sidebar: mobile drawer + `lg:block`
- Table: `overflow-x-auto` + `min-w-[900px]`
- Text: `text-sm` → `text-base`
- Padding: `p-4 sm:p-6`

## ⚡ Performance
- `next/image` with `sizes`
- Aspect ratio (`aspect-square`) — no layout shift
- `priority` above-fold
- `loading.tsx` + `Suspense`
- Lazy below-fold

## 🔍 SEO
- `generateMetadata` every page
- Semantic HTML (`main`, `article`, `section`, `nav`)
- One `<h1>` per page
- JSON-LD (Product, Breadcrumb)
- Canonical + OG + Twitter

## ♿ A11y
- `aria-label` on icon buttons
- `<FormLabel>` on inputs
- Image `alt`
- Focus ring
- Keyboard nav
- WCAG AA contrast

## 🎬 Animation
- `transition-colors`, `hover:scale-[1.02]`
- 150–300ms
- `active:scale-[0.98]`
- `prefers-reduced-motion`

## 🌐 BD Context
- ৳ price, `toLocaleString()`
- Date `en-GB`
- BD address (division/district/upazila)
- bKash / Rocket / Nagad

## 🚫 NEVER
- ❌ Hardcoded colors
- ❌ Inline styles (except dynamic)
- ❌ Custom CSS files
- ❌ `any` type
- ❌ Client Component for static
- ❌ Lorem ipsum in production
- ❌ `<div onClick>` (use `<button>`)
- ❌ Missing `key`
- ❌ `dangerouslySetInnerHTML` with user input
- ❌ Manual `max-w-*` — use `.mxw`

## ✅ ALWAYS
- ✅ Server Component first
- ✅ ShadCN primitives
- ✅ Semantic tokens
- ✅ `.mxw` for width
- ✅ `.section-padding` for spacing
- ✅ `next/image` with `sizes`
- ✅ `next/link`
- ✅ Loading skeleton
- ✅ Error boundary
- ✅ Empty state
- ✅ Toast on action
- ✅ `tabular-nums` on numbers
- ✅ Types in `lib/types/`