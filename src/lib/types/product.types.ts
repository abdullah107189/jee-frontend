export type ProductCardData = {
  id: string;
  name: string;
  slug: string;

  price: number;
  comparePrice: number | null;

  image: string | null;

  warrantyMonths: number;
  stockQuantity: number;

  brandName: string | null;
  categoryName: string | null;
};
