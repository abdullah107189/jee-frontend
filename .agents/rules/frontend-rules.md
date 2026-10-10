---
trigger: always_on
---

# Frontend Rules — JEE

## Loading & Error States

### Every dashboard folder must have:
```
app/(dashboard)/.../loading.tsx
app/(dashboard)/.../error.tsx
```

### `loading.tsx` — Skeleton matching layout
```tsx
export default function Loading() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}
```

### `error.tsx` — Route-level error boundary
```tsx
"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
      <Button onClick={reset} className="mt-6">Try again</Button>
    </div>
  );
}
```

## Real API Only — No Mock Data

### Server Component Fetch Pattern
```ts
// services/<feature>.service.ts
import "server-only";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL!;

export async function getData() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/...`, {
      headers: { Cookie: cookieStore.toString() },
      next: { revalidate: 300, tags: ["<feature>"] },
    });
    if (!res.ok) return { data: null };
    return res.json();
  } catch {
    return { data: null };
  }
}
```

### Server Action (Mutations)
```ts
"use server";
export async function createXAction(prevState, formData) {
  const cookieStore = await cookies();
  const res = await fetch(`${API_URL}/xs`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookieStore.toString() },
    body: JSON.stringify({ ... }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) return { success: false, message: json.message };
  revalidateTag("xs", "max");
  return { success: true, message: json.message, id: json.data.id };
}
```

## Client State Rules
- **Redux persist** → cart ONLY
- Everything else → Server Component or Server Actions
- No client-side global state for server data

## Tailwind v4 + ShadCN
- Use ShadCN components for all UI primitives
- Dark/light mode via `next-themes` (if configured)
- Clean layout — no inline styles
- Use `cn()` from `@/lib/utils` for conditional classes

## Do NOT
- ❌ Mock arrays in pages/services
- ❌ `useEffect` fetch in Client Components
- ❌ `fetch` without error handling
- ❌ Missing loading/error states
- ❌ Hardcoded strings for API URLs