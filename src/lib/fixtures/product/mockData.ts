// import {
//   Product,
//   ProductFilters,
//   ProductItem,
//   ProductListResponse,
// } from "@/lib/types/product.types";
// import { Brand, Category } from "./types";

// {
//   id: 'prod_1',
//   slug: 'vision-56-ceiling-fan',
//   name: 'Vision 56" High Speed Ceiling Fan',
//   category: 'Fans',
//   brand: 'Vision',
//   price: 15000,
//   originalPrice: 18000,
//   rating: 4.8,
//   reviewsCount: 120,
//   warrantyMonths: 24,
//   inStock: true,
//   featured: true,
//   isLatest: true,
//   image: 'https://images.unsplash.com/photo-1570114681640-1090333fa965?auto=format&fit=crop&w=600&q=80',
//   images: [
//     'https://images.unsplash.com/photo-1570114681640-1090333fa965?auto=format&fit=crop&w=800&q=80',
//     'https://images.unsplash.com/photo-1618941723615-3303c1169090?auto=format&fit=crop&w=800&q=80',
//   ],
//   description:
//     'Aerodynamically designed 56 inch aluminum blades for maximum airflow and energy efficiency. Engineered with premium 100% copper motor.',
//   specs: [
//     { label: 'Brand', value: 'Vision Electronics' },
//     { label: 'Model', value: '56" Royal Ceiling Fan' },
//     { label: 'Power Consumption', value: '75 Watts' },
//     { label: 'Motor Wire', value: '100% Super Enameled Copper Wire' },
//     { label: 'Warranty Period', value: '24 Months Replacement Warranty' },
//   ],
//   warrantyTerms:
//     '24 Months full replacement warranty on motor burn or coil breakdown. Mechanical damage, water immersion, or high-voltage spike burnout is excluded.',
// }

// export const MOCK_PRODUCTS: ProductItem[] = [
//   {
//     id: "item_001",
//     productId: "prod_001",
//     uniqueId: "VIS-FAN-001",
//     serialNumber: "VIS20260001",

//     status: "AVAILABLE",

//     metadata: {
//       color: "White",
//       bladeSize: '56"',
//       motorType: "Copper",
//     },

//     manufacturedAt: "2026-01-10",

//     createdAt: "2026-02-01",
//     updatedAt: "2026-02-01",
//     deletedAt: null,

//     product: {
//       id: "prod_001",

//       name: 'Vision 56" High Speed Ceiling Fan',
//       slug: "vision-56-high-speed-ceiling-fan",

//       description:
//         'Aerodynamically designed 56" ceiling fan with premium copper motor for powerful airflow and energy efficiency.',

//       specifications: [
//         {
//           label: "Model",
//           value: '56" Royal Ceiling Fan',
//         },
//         {
//           label: "Blade Size",
//           value: "56 Inches",
//         },
//         {
//           label: "Power Consumption",
//           value: "75 Watts",
//         },
//         {
//           label: "Motor",
//           value: "100% Copper",
//         },
//         {
//           label: "Speed",
//           value: "320 RPM",
//         },
//       ],

//       price: 4500,
//       comparePrice: 5200,
//       cost: 3500,

//       discount: 700,
//       discountType: "FIXED",

//       sku: "VIS-FAN-56",

//       warrantyMonths: 24,

//       warrantyTerms:
//         "24 months replacement warranty on motor and coil breakdown. Physical and voltage damage excluded.",

//       stockQuantity: 18,
//       lowStockThreshold: 5,

//       images: ["/fan.jpg"],

//       attributes: {
//         color: "White",
//         bladeSize: '56"',
//         bladeCount: 3,
//         motorType: "Copper",
//         speed: "320 RPM",
//       },

//       isPublished: true,
//       isActive: true,

//       categoryId: "cat_fans",
//       brandId: "brand_vision",

//       createdAt: "2026-02-01",
//       updatedAt: "2026-02-01",
//       deletedAt: null,
//     },
//   },

//   {
//     id: "item_002",
//     productId: "prod_002",
//     uniqueId: "WAL-FAN-001",
//     serialNumber: "WAL20260001",

//     status: "AVAILABLE",

//     metadata: {
//       color: "Black",
//       bladeSize: '56"',
//       motorType: "Copper",
//     },

//     manufacturedAt: "2026-01-15",

//     createdAt: "2026-02-02",
//     updatedAt: "2026-02-02",
//     deletedAt: null,

//     product: {
//       id: "prod_002",

//       name: 'Walton 56" Super Speed Ceiling Fan',
//       slug: "walton-56-super-speed-ceiling-fan",

//       description:
//         "High-speed Walton ceiling fan with durable blades and powerful copper motor designed for comfortable airflow.",

//       specifications: [
//         {
//           label: "Model",
//           value: "WCF56",
//         },
//         {
//           label: "Blade Size",
//           value: '56"',
//         },
//         {
//           label: "Power Consumption",
//           value: "80 Watts",
//         },
//         {
//           label: "Motor",
//           value: "Copper",
//         },
//         {
//           label: "Speed",
//           value: "330 RPM",
//         },
//       ],

//       price: 4990,
//       comparePrice: 5590,
//       cost: 3900,

//       discount: 600,
//       discountType: "FIXED",

//       sku: "WAL-FAN-56",

//       warrantyMonths: 24,

//       warrantyTerms:
//         "24 months warranty against manufacturing defects and motor-related issues.",

//       stockQuantity: 12,
//       lowStockThreshold: 5,

//       images: ["/fan.jpg"],

//       attributes: {
//         color: "Black",
//         bladeSize: '56"',
//         bladeCount: 3,
//         motorType: "Copper",
//         speed: "330 RPM",
//       },

//       isPublished: true,
//       isActive: true,

//       categoryId: "cat_fans",
//       brandId: "brand_walton",

//       createdAt: "2026-02-02",
//       updatedAt: "2026-02-02",
//       deletedAt: null,
//     },
//   },

//   {
//     id: "item_003",
//     productId: "prod_003",
//     uniqueId: "PHI-LED-001",
//     serialNumber: "PHI20260001",

//     status: "AVAILABLE",

//     metadata: {
//       watt: 18,
//       color: "Cool White",
//       base: "B22",
//     },

//     manufacturedAt: "2026-01-20",

//     createdAt: "2026-02-03",
//     updatedAt: "2026-02-03",
//     deletedAt: null,

//     product: {
//       id: "prod_003",

//       name: "Philips 18W LED Bulb",
//       slug: "philips-18w-led-bulb",

//       description:
//         "Energy efficient Philips LED bulb with bright cool white illumination for residential and commercial use.",

//       specifications: [
//         {
//           label: "Power",
//           value: "18W",
//         },
//         {
//           label: "Color Temperature",
//           value: "6500K",
//         },
//         {
//           label: "Base",
//           value: "B22",
//         },
//         {
//           label: "Lifespan",
//           value: "15,000 Hours",
//         },
//       ],

//       price: 320,
//       comparePrice: 380,
//       cost: 240,

//       discount: 60,
//       discountType: "FIXED",

//       sku: "PHI-LED-18W",

//       warrantyMonths: 12,

//       warrantyTerms:
//         "12 months replacement warranty against manufacturing defects.",

//       stockQuantity: 65,
//       lowStockThreshold: 10,

//       images: ["/fan.jpg"],

//       attributes: {
//         watt: 18,
//         color: "Cool White",
//         base: "B22",
//         type: "LED",
//       },

//       isPublished: true,
//       isActive: true,

//       categoryId: "cat_lights",
//       brandId: "brand_philips",

//       createdAt: "2026-02-03",
//       updatedAt: "2026-02-03",
//       deletedAt: null,
//     },
//   },

//   {
//     id: "item_004",
//     productId: "prod_004",
//     uniqueId: "GRE-AC-001",
//     serialNumber: "GRE20260001",

//     status: "AVAILABLE",

//     metadata: {
//       capacity: "1.5 Ton",
//       inverter: true,
//       color: "White",
//     },

//     manufacturedAt: "2026-01-05",

//     createdAt: "2026-02-04",
//     updatedAt: "2026-02-04",
//     deletedAt: null,

//     product: {
//       id: "prod_004",

//       name: "Gree 1.5 Ton Inverter AC",
//       slug: "gree-1-5-ton-inverter-ac",

//       description:
//         "Energy-efficient inverter air conditioner with fast cooling technology and comfortable temperature control.",

//       specifications: [
//         {
//           label: "Capacity",
//           value: "1.5 Ton",
//         },
//         {
//           label: "Type",
//           value: "Inverter",
//         },
//         {
//           label: "Cooling Capacity",
//           value: "18000 BTU",
//         },
//         {
//           label: "Refrigerant",
//           value: "R32",
//         },
//         {
//           label: "Compressor Warranty",
//           value: "10 Years",
//         },
//       ],

//       price: 57900,
//       comparePrice: 62500,
//       cost: 51000,

//       discount: 4600,
//       discountType: "FIXED",

//       sku: "GRE-AC-15INV",

//       warrantyMonths: 120,

//       warrantyTerms:
//         "10 years compressor warranty and 2 years spare parts warranty.",

//       stockQuantity: 6,
//       lowStockThreshold: 2,

//       images: ["/fan.jpg"],

//       attributes: {
//         capacity: "1.5 Ton",
//         inverter: true,
//         refrigerant: "R32",
//         coolingCapacity: "18000 BTU",
//       },

//       isPublished: true,
//       isActive: true,

//       categoryId: "cat_ac",
//       brandId: "brand_gree",

//       createdAt: "2026-02-04",
//       updatedAt: "2026-02-04",
//       deletedAt: null,
//     },
//   },

//   {
//     id: "item_005",
//     productId: "prod_005",
//     uniqueId: "WAL-FRIDGE-001",
//     serialNumber: "WFR20260001",

//     status: "AVAILABLE",

//     metadata: {
//       capacity: "343L",
//       color: "Black",
//     },

//     manufacturedAt: "2026-01-08",

//     createdAt: "2026-02-05",
//     updatedAt: "2026-02-05",
//     deletedAt: null,

//     product: {
//       id: "prod_005",

//       name: "Walton 343L No Frost Refrigerator",
//       slug: "walton-343l-no-frost-refrigerator",

//       description:
//         "Modern no-frost refrigerator with spacious storage, energy-efficient cooling and premium finish.",

//       specifications: [
//         {
//           label: "Capacity",
//           value: "343 Liters",
//         },
//         {
//           label: "Type",
//           value: "No Frost",
//         },
//         {
//           label: "Refrigerant",
//           value: "R600a",
//         },
//         {
//           label: "Energy Rating",
//           value: "5 Star",
//         },
//       ],

//       price: 52990,
//       comparePrice: 56990,
//       cost: 47000,

//       discount: 4000,
//       discountType: "FIXED",

//       sku: "WAL-FRIDGE-343",

//       warrantyMonths: 120,

//       warrantyTerms:
//         "10 years compressor warranty with standard service warranty.",

//       stockQuantity: 8,
//       lowStockThreshold: 2,

//       images: ["/fan.jpg"],

//       attributes: {
//         capacity: "343L",
//         type: "No Frost",
//         color: "Black",
//         energyRating: "5 Star",
//       },

//       isPublished: true,
//       isActive: true,

//       categoryId: "cat_refrigerator",
//       brandId: "brand_walton",

//       createdAt: "2026-02-05",
//       updatedAt: "2026-02-05",
//       deletedAt: null,
//     },
//   },
// ];

// export const MOCK_CATEGORIES: Category[] = [
//   {
//     categoryId: "cat_fans",
//     name: "Fans",
//     slug: "fans",
//     productCount: 2,
//   },
//   {
//     categoryId: "cat_ac",
//     name: "AC",
//     slug: "ac",
//     productCount: 1,
//   },
//   {
//     categoryId: "cat_lights",
//     name: "Lights",
//     slug: "lights",
//     productCount: 1,
//   },
//   {
//     categoryId: "cat_refrigerator",
//     name: "Refrigerator",
//     slug: "refrigerator",
//     productCount: 1,
//   },
// ];

// export const MOCK_BRANDS: Brand[] = [
//   {
//     brandId: "brand_vision",
//     name: "Vision",
//     slug: "vision",
//     productCount: 1,
//   },
//   {
//     brandId: "brand_walton",
//     name: "Walton",
//     slug: "walton",
//     productCount: 2,
//   },
//   {
//     brandId: "brand_philips",
//     name: "Philips",
//     slug: "philips",
//     productCount: 1,
//   },
//   {
//     brandId: "brand_gree",
//     name: "Gree",
//     slug: "gree",
//     productCount: 1,
//   },
// ];


// export function filterProducts(
//   products: ProductItem[],
//   filters: ProductFilters = {},
// ): ProductItem[] {
//   const search = filters.search?.trim().toLowerCase();

//   return products.filter((item) => {
//     const product = item.product;

//     // Search
//     if (search) {
//       const searchableText = [
//         product.name,
//         product.slug,
//         product.sku,
//         item.uniqueId,
//         item.serialNumber,
//       ]
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase();

//       if (!searchableText.includes(search)) {
//         return false;
//       }
//     }

//     // Category
//     if (
//       filters.categoryId &&
//       product.categoryId !== filters.categoryId
//     ) {
//       return false;
//     }

//     // Brand
//     if (
//       filters.brandId &&
//       product.brandId !== filters.brandId
//     ) {
//       return false;
//     }

//     // Min price
//     if (
//       filters.minPrice != null &&
//       product.price < filters.minPrice
//     ) {
//       return false;
//     }

//     // Max price
//     if (
//       filters.maxPrice != null &&
//       product.price > filters.maxPrice
//     ) {
//       return false;
//     }

//     // Published
//     if (
//       filters.isPublished != null &&
//       product.isPublished !== filters.isPublished
//     ) {
//       return false;
//     }

//     // Active
//     if (
//       filters.isActive != null &&
//       product.isActive !== filters.isActive
//     ) {
//       return false;
//     }

//     // Item status
//     if (
//       filters.status &&
//       item.status !== filters.status
//     ) {
//       return false;
//     }

//     return true;
//   });
// }


// export function mockGetProducts(
//   filters: ProductFilters = {},
// ): ProductListResponse {
//   const page = filters.page ?? 1;
//   const limit = filters.limit ?? 12;

//   const filtered = filterProducts(
//     MOCK_PRODUCTS,
//     filters,
//   );

//   const total = filtered.length;

//   const totalPages = Math.max(
//     1,
//     Math.ceil(total / limit),
//   );

//   const start = (page - 1) * limit;

//   return {
//     data: filtered.slice(
//       start,
//       start + limit,
//     ),
//     total,
//     page,
//     limit,
//     totalPages,
//   };
// }

// export function mockGetProductBySlug(
//   slug: string,
// ): ProductItem | null {
//   const productItem = MOCK_PRODUCTS.find(
//     (item) => item.product.slug === slug,
//   );

//   if (!productItem) {
//     return null;
//   }

//   const relatedProducts = MOCK_PRODUCTS
//     .filter(
//       (item) =>
//         item.product.categoryId === productItem.product.categoryId &&
//         item.productId !== productItem.productId,
//     )
//     .slice(0, 3);

//   return {
//     ...productItem,
//     relatedProducts,
//   };
// }


// export function mockSearchProducts(query: string, limit = 12): ProductItem[] {
//   return filterProducts(MOCK_PRODUCTS, {
//     search: query,
//   }).slice(0, limit);
// }
