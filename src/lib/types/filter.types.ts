export type FilterType = "MULTI_SELECT" | "SINGLE_SELECT" | "RANGE" | "BOOLEAN";

export interface FilterOptionAdmin {
  id?: string;
  value: string;
  label?: string;
  sortOrder?: number;
}

export interface FilterAdmin {
  id?: string;
  name: string;
  label?: string;
  type: FilterType;
  sortOrder?: number;
  options: FilterOptionAdmin[];
}

export interface FilterGroupAdmin {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
    fullSlug: string;
  };
  sortOrder: number;
  isActive: boolean;
  filters: FilterAdmin[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FilterGroupListItem {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
    fullSlug: string;
  };
  _count?: {
    filters: number;
  };
}

export interface FilterGroupFormValues {
  name: string;
  slug?: string;
  categoryId: string;
  sortOrder?: number;
  isActive?: boolean;
  filters: FilterAdmin[];
}

export interface FilterActionState {
  success: boolean;
  message: string;
  groupId?: string;
  fieldErrors?: Record<string, string[]>;
}