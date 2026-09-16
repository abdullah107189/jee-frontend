export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  level: number;
  icon: string | null;
  _count: {
    products: number;
  };
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
}

export interface WarrantyFilterOption {
  months: number;
  label: string;
}
