export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  fullSlug: string;
  description: string | null;
  parentId: string | null;
  level: number;
  icon: string | null;
  image: string | null;
  sortOrder: number;
  productCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  parent?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  children?: AdminCategory[];
}

export interface CategoryFormValues {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
  icon?: string;
  image?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CategoryActionState {
  success: boolean;
  message: string;
  categoryId?: string;
  fieldErrors?: Record<string, string[]>;
}