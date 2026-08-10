import type { Brand, Category, PaginatedProductsResponse, Product, ProductFilters } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    slug: 'vision-56-ceiling-fan',
    name: 'Vision 56" High Speed Ceiling Fan',
    category: 'Fans',
    brand: 'Vision',
    price: 15000,
    originalPrice: 18000,
    rating: 4.8,
    reviewsCount: 120,
    warrantyMonths: 24,
    inStock: true,
    featured: true,
    isLatest: true,
    image: 'https://images.unsplash.com/photo-1570114681640-1090333fa965?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1570114681640-1090333fa965?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618941723615-3303c1169090?auto=format&fit=crop&w=800&q=80',
    ],
    description:
      'Aerodynamically designed 56 inch aluminum blades for maximum airflow and energy efficiency. Engineered with premium 100% copper motor.',
    specs: [
      { label: 'Brand', value: 'Vision Electronics' },
      { label: 'Model', value: '56" Royal Ceiling Fan' },
      { label: 'Power Consumption', value: '75 Watts' },
      { label: 'Motor Wire', value: '100% Super Enameled Copper Wire' },
      { label: 'Warranty Period', value: '24 Months Replacement Warranty' },
    ],
    warrantyTerms:
      '24 Months full replacement warranty on motor burn or coil breakdown. Mechanical damage, water immersion, or high-voltage spike burnout is excluded.',
  },
  {
    id: 'prod_2',
    slug: 'vision-ac-15-ton-inverter',
    name: 'Vision AC 1.5 Ton Dual Inverter',
    category: 'AC',
    brand: 'Vision',
    price: 45000,
    originalPrice: 52000,
    rating: 4.9,
    reviewsCount: 84,
    warrantyMonths: 36,
    inStock: true,
    featured: true,
    isLatest: true,
    image: 'https://images.unsplash.com/photo-1621016834575-b60b7d7f7fa2?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1621016834575-b60b7d7f7fa2?auto=format&fit=crop&w=800&q=80'],
    description:
      'Ultra fast cooling with 60% energy saving dual inverter compressor. Built-in PM 2.5 air purification filter.',
    specs: [
      { label: 'Brand', value: 'Vision' },
      { label: 'Capacity', value: '1.5 Ton (18,000 BTU)' },
      { label: 'Refrigerant', value: 'R32 Eco-Friendly' },
      { label: 'Compressor Warranty', value: '36 Months Warranty' },
    ],
    warrantyTerms: '36 Months warranty on compressor and 12 months comprehensive unit warranty.',
  },
  {
    id: 'prod_3',
    slug: 'led-bulb-15w-heavy',
    name: 'Vision Ultra Bright LED Bulb 15W',
    category: 'Lights',
    brand: 'Vision',
    price: 350,
    originalPrice: 420,
    rating: 4.6,
    reviewsCount: 230,
    warrantyMonths: 12,
    inStock: true,
    featured: false,
    isLatest: true,
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80'],
    description: 'Long-lasting 15W cool daylight LED bulb with high lumen output and surge protection.',
    specs: [
      { label: 'Brand', value: 'Vision' },
      { label: 'Wattage', value: '15W' },
      { label: 'Color', value: 'Cool Daylight 6500K' },
      { label: 'Warranty', value: '12 Months' },
    ],
    warrantyTerms: '12 Months manufacturer defect warranty.',
  },
  {
    id: 'prod_4',
    slug: 'dry-iron-1000w-heavy',
    name: 'Vision Heavy Duty Dry Iron 1000W',
    category: 'Appliances',
    brand: 'Vision',
    price: 1500,
    originalPrice: 1850,
    rating: 4.7,
    reviewsCount: 95,
    warrantyMonths: 24,
    inStock: true,
    featured: true,
    isLatest: false,
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80'],
    description: 'Golden non-stick coated soleplate with adjustable temperature control dial.',
    specs: [
      { label: 'Brand', value: 'Vision' },
      { label: 'Power', value: '1000W' },
      { label: 'Soleplate', value: 'Non-stick Ceramic Coating' },
      { label: 'Warranty', value: '24 Months' },
    ],
    warrantyTerms: '24 Months manufacturer defect warranty.',
  },
  {
    id: 'prod_5',
    slug: 'super-blender-750w',
    name: 'Vision Super Commercial Blender 750W',
    category: 'Appliances',
    brand: 'Vision',
    price: 3800,
    originalPrice: 4500,
    rating: 4.5,
    reviewsCount: 62,
    warrantyMonths: 24,
    inStock: true,
    featured: true,
    isLatest: true,
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80'],
    description: 'Heavy duty 750W copper motor with 3 stainless steel jars.',
    specs: [
      { label: 'Brand', value: 'Vision' },
      { label: 'Power', value: '750W' },
      { label: 'Jars', value: '3 Stainless Steel' },
      { label: 'Warranty', value: '24 Months' },
    ],
    warrantyTerms: '24 Months manufacturer defect warranty.',
  },
  {
    id: 'prod_6',
    slug: 'high-speed-table-fan-16',
    name: 'Vision High Speed Oscillating Table Fan 16"',
    category: 'Fans',
    brand: 'Vision',
    price: 2800,
    originalPrice: 3200,
    rating: 4.6,
    reviewsCount: 41,
    warrantyMonths: 24,
    inStock: true,
    featured: false,
    isLatest: true,
    image: 'https://images.unsplash.com/photo-1618941723615-3303c1169090?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1618941723615-3303c1169090?auto=format&fit=crop&w=800&q=80'],
    description: 'Whisper quiet 16 inch table fan with 3 speed push button controls.',
    specs: [
      { label: 'Brand', value: 'Vision' },
      { label: 'Size', value: '16 Inch' },
      { label: 'Speed', value: '3 Speeds' },
      { label: 'Warranty', value: '24 Months' },
    ],
    warrantyTerms: '24 Months manufacturer defect warranty.',
  },
  {
    id: 'prod_7',
    slug: 'smart-led-tv-43',
    name: 'Vision Smart LED TV 43"',
    category: 'Appliances',
    brand: 'Vision',
    price: 32000,
    originalPrice: 38000,
    rating: 4.7,
    reviewsCount: 56,
    warrantyMonths: 24,
    inStock: true,
    featured: true,
    isLatest: true,
    image: 'https://images.unsplash.com/photo-1593359677870-a4bb92f829d1?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1593359677870-a4bb92f829d1?auto=format&fit=crop&w=800&q=80'],
    description: '43 inch Full HD Smart TV with built-in streaming apps and HDR support.',
    specs: [
      { label: 'Brand', value: 'Vision' },
      { label: 'Screen Size', value: '43 Inches' },
      { label: 'Resolution', value: 'Full HD 1080p' },
      { label: 'Warranty', value: '24 Months' },
    ],
    warrantyTerms: '24 Months panel and parts warranty.',
  },
  {
    id: 'prod_8',
    slug: 'portable-fan-rechargeable',
    name: 'Vision Rechargeable Portable Fan',
    category: 'Fans',
    brand: 'Walton',
    price: 1200,
    originalPrice: 1500,
    rating: 4.4,
    reviewsCount: 88,
    warrantyMonths: 12,
    inStock: true,
    featured: false,
    isLatest: true,
    image: 'https://images.unsplash.com/photo-1618941723615-3303c1169090?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1618941723615-3303c1169090?auto=format&fit=crop&w=800&q=80'],
    description: 'USB rechargeable portable fan with 8-hour battery backup.',
    specs: [
      { label: 'Brand', value: 'Walton' },
      { label: 'Battery', value: '4000mAh' },
      { label: 'Runtime', value: '8 Hours' },
      { label: 'Warranty', value: '12 Months' },
    ],
    warrantyTerms: '12 Months manufacturer defect warranty.',
  },
  {
    id: 'prod_9',
    slug: 'microwave-25l-inverter',
    name: 'Vision Smart Inverter Microwave 25L',
    category: 'Appliances',
    brand: 'Vision',
    price: 8500,
    originalPrice: 9800,
    rating: 4.5,
    reviewsCount: 34,
    warrantyMonths: 24,
    inStock: true,
    featured: false,
    isLatest: false,
    image: 'https://images.unsplash.com/photo-1585659722983-3b675a370a98?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1585659722983-3b675a370a98?auto=format&fit=crop&w=800&q=80'],
    description: '25L inverter microwave with grill function and child lock.',
    specs: [
      { label: 'Brand', value: 'Vision' },
      { label: 'Capacity', value: '25 Liters' },
      { label: 'Power', value: '900W' },
      { label: 'Warranty', value: '24 Months' },
    ],
    warrantyTerms: '24 Months manufacturer defect warranty.',
  },
  {
    id: 'prod_10',
    slug: 'led-strip-5m',
    name: 'Vision RGB LED Strip Light 5M',
    category: 'Lights',
    brand: 'Walton',
    price: 650,
    originalPrice: 800,
    rating: 4.3,
    reviewsCount: 112,
    warrantyMonths: 12,
    inStock: true,
    featured: false,
    isLatest: true,
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80'],
    description: 'Smart RGB LED strip with remote control and adhesive backing.',
    specs: [
      { label: 'Brand', value: 'Walton' },
      { label: 'Length', value: '5 Meters' },
      { label: 'Type', value: 'RGB with Remote' },
      { label: 'Warranty', value: '12 Months' },
    ],
    warrantyTerms: '12 Months manufacturer defect warranty.',
  },
  {
    id: 'prod_11',
    slug: 'split-ac-2-ton',
    name: 'Vision AC 2 Ton Inverter Split',
    category: 'AC',
    brand: 'Vision',
    price: 68000,
    originalPrice: 75000,
    rating: 4.8,
    reviewsCount: 45,
    warrantyMonths: 36,
    inStock: true,
    featured: true,
    isLatest: false,
    image: 'https://images.unsplash.com/photo-1621016834575-b60b7d7f7fa2?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1621016834575-b60b7d7f7fa2?auto=format&fit=crop&w=800&q=80'],
    description: '2 Ton dual inverter split AC with Wi-Fi control and 5-star rating.',
    specs: [
      { label: 'Brand', value: 'Vision' },
      { label: 'Capacity', value: '2 Ton (24,000 BTU)' },
      { label: 'Energy Rating', value: '5 Star' },
      { label: 'Warranty', value: '36 Months' },
    ],
    warrantyTerms: '36 Months compressor warranty.',
  },
  {
    id: 'prod_12',
    slug: 'ceiling-fan-48',
    name: 'Vision 48" Premium Ceiling Fan',
    category: 'Fans',
    brand: 'Vision',
    price: 12000,
    originalPrice: 14000,
    rating: 4.7,
    reviewsCount: 78,
    warrantyMonths: 24,
    inStock: true,
    featured: false,
    isLatest: false,
    image: 'https://images.unsplash.com/photo-1570114681640-1090333fa965?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1570114681640-1090333fa965?auto=format&fit=crop&w=800&q=80'],
    description: '48 inch premium ceiling fan with remote control and LED light.',
    specs: [
      { label: 'Brand', value: 'Vision' },
      { label: 'Size', value: '48 Inches' },
      { label: 'Remote', value: 'Yes' },
      { label: 'Warranty', value: '24 Months' },
    ],
    warrantyTerms: '24 Months motor warranty.',
  },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Fans', slug: 'fans', productCount: 4 },
  { id: 'cat_2', name: 'AC', slug: 'ac', productCount: 2 },
  { id: 'cat_3', name: 'Lights', slug: 'lights', productCount: 2 },
  { id: 'cat_4', name: 'Appliances', slug: 'appliances', productCount: 4 },
];

export const MOCK_BRANDS: Brand[] = [
  { id: 'brand_1', name: 'Vision', slug: 'vision', productCount: 10 },
  { id: 'brand_2', name: 'Walton', slug: 'walton', productCount: 2 },
];

function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  let result = [...products];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }

  if (filters.category && filters.category !== 'ALL') {
    result = result.filter((p) => p.category.toLowerCase() === filters.category!.toLowerCase());
  }

  if (filters.brand && filters.brand !== 'ALL') {
    result = result.filter((p) => p.brand.toLowerCase() === filters.brand!.toLowerCase());
  }

  if (filters.minPrice != null) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice != null) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.featured) {
    result = result.filter((p) => p.featured);
  }

  if (filters.isLatest) {
    result = result.filter((p) => p.isLatest);
  }

  if (filters.sortBy === 'price-low') {
    result.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'price-high') {
    result.sort((a, b) => b.price - a.price);
  } else if (filters.sortBy === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  }

  return result;
}

export function mockGetProducts(filters: ProductFilters = {}): PaginatedProductsResponse {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const filtered = filterProducts(MOCK_PRODUCTS, filters);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;

  return {
    data: filtered.slice(start, start + limit),
    total,
    page,
    limit,
    totalPages,
  };
}

export function mockGetProductBySlug(slug: string): Product | null {
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return null;

  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  )
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      image: p.image,
      warrantyMonths: p.warrantyMonths,
    }));

  return { ...product, relatedProducts };
}

export function mockSearchProducts(query: string, limit = 12): Product[] {
  return filterProducts(MOCK_PRODUCTS, { search: query, limit }).slice(0, limit);
}
