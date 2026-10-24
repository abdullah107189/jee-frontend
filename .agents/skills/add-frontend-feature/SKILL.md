# Skill — Add Frontend Feature

## Standard Workflow

### 1. Service (`src/services/<feature>.service.ts`)
```ts
import "server-only";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL!;

export async function getAll<Feature>() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/<feature>`, {
      headers: { Cookie: cookieStore.toString() },
      next: { revalidate: 300, tags: ["<feature>"] },
    });
    if (!res.ok) return { data: [], total: 0 };
    return res.json();
  } catch {
    return { data: [], total: 0 };
  }
}
```

### 2. Types (`src/lib/types/<feature>.types.ts`)
```ts
export interface FeatureItem {
  id: string;
  name: string;
  // ...
}

export interface FeatureActionState {
  success: boolean;
  message: string;
  id?: string;
  fieldErrors?: Record<string, string[]>;
}
```

### 3. Server Action (`src/actions/<feature>.actions.ts`)
```ts
"use server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export async function createFeatureAction(prevState, formData: FormData) {
  const payload = { ... };
  const cookieStore = await cookies();
  const res = await fetch(`${process.env.API_URL}/<feature>`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookieStore.toString() },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) return { success: false, message: json.message };
  revalidateTag("<feature>", "max");
  return { success: true, message: json.message, id: json.data.id };
}
```

### 4. Server Component Page (`src/app/.../<feature>/page.tsx`)
```tsx
import type { Metadata } from "next";
import { getAll<Feature> } from "@/services/<feature>.service";
import { FeatureList } from "@/components/modules/<feature>/feature-list";

export const metadata: Metadata = {
  title: "<Feature> — JEE Store",
};

export default async function FeaturePage() {
  const data = await getAll<Feature>();
  return <FeatureList items={data} />;
}
```

### 5. Loading + Error
```
src/app/.../<feature>/loading.tsx
src/app/.../<feature>/error.tsx
```

### 6. Components (`src/components/modules/<feature>/`)
```
├── feature-list.tsx          # Server or Client
├── feature-card.tsx
├── feature-form.tsx          # "use client" + RHF + Zod
└── _components/
    ├── small-piece-1.tsx
    └── small-piece-2.tsx
```

### 7. Client Component (if interactive)
```tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export function FeatureForm() {
  const form = useForm({ resolver: zodResolver(schema) });
  // ...
}
```

### 8. Admin CRUD (if needed)
```
app/(dashboard)/admin/<feature>/
├── page.tsx                 # list
├── new/page.tsx             # create
└── [id]/edit/page.tsx       # edit

components/modules/admin/<feature>/
├── <feature>-list.tsx
├── <feature>-form.tsx
└── <feature>-delete-dialog.tsx
```

### 9. Add Sidebar Link
Edit `components/layout/Sidebar.tsx` — add to ADMIN/SELLER/CUSTOMER menu.

### 10. Test
- Route loads data?
- Loading skeleton?
- Error boundary?
- Actions succeed + cache invalidated?
- Mobile responsive?

## Checklist
- [ ] Service (`services/<feature>.service.ts`) — server-only
- [ ] Types (`lib/types/<feature>.types.ts`)
- [ ] Server Action (`actions/<feature>.actions.ts`)
- [ ] Page (`app/.../<feature>/page.tsx`) — Server Component
- [ ] `loading.tsx` + `error.tsx`
- [ ] Components in `components/modules/<feature>/`
- [ ] Sidebar link (if dashboard)
- [ ] No mock data
- [ ] Tested end-to-end

## Conventions
- Files: `kebab-case.tsx`
- Components: `PascalCase` export
- Server Actions: `camelCase` + `Action` suffix
- Route folders: `kebab-case`
- `"use client"` only when interactivity needed