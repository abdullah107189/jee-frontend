// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {
//   ArrowLeft,
//   ArrowRight,
//   Search,
//   ShoppingBag,
//   SlidersHorizontal,
//   Star,
//   X,
// } from "lucide-react";
// import { toast } from "sonner";

// import { Badge } from "@/components/ui/Badge";
// import { Button } from "@/components/ui/Button";
// import { Card, CardContent } from "@/components/ui/Card";
// import { Input } from "@/components/ui/Input";

// import { useDebounce } from "@/hooks/useDebounce";
// import { useAppDispatch } from "@/store/hooks";
// import { addToCart } from "@/store/slices/cartSlice";
// import type { Brand, Category } from "@/lib/fixtures/product/types";
// import MainProductCard from "./MainProductCard";
// import { ProductCardData, ProductListResponse } from "@/lib/types/product.types";
// import { CartItemInput } from "@/lib/types/cart.types";

// function formatPrice(value: number) {
//   return `৳${value.toLocaleString()}`;
// }

// interface ProductsCatalogProps {
//   initialSearch: string;
//   initialCategory: string;
//   initialBrand: string;
//   initialMinPrice: string;
//   initialMaxPrice: string;
//   initialPage: number;
//   initialProducts: ProductListResponse;
//   categories: Category[];
//   brands: Brand[];
// }

// export default function ProductsCatalog({
//   initialSearch,
//   initialCategory,
//   initialBrand,
//   initialMinPrice,
//   initialMaxPrice,
//   initialPage,
//   initialProducts,
//   categories,
//   brands,
// }: ProductsCatalogProps) {
//   const router = useRouter();
//   const dispatch = useAppDispatch();

//   const [searchTerm, setSearchTerm] = useState(initialSearch);
//   const [selectedCategory, setSelectedCategory] = useState(initialCategory);
//   const [selectedBrand, setSelectedBrand] = useState(initialBrand);
//   const [minPrice, setMinPrice] = useState(initialMinPrice);
//   const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
//   const [page, setPage] = useState(initialPage);

//   const debouncedSearch = useDebounce(searchTerm, 350);

//   const products = initialProducts.data;
//   const totalPages = initialProducts.meta.totalPages;
//   const totalItems = initialProducts.total;
//   const isLoading = false;
//   const isFetching = false;

//   /*
//    * Reset page when filters change.
//    */
//   useEffect(() => {
//     setPage(1);
//   }, [debouncedSearch, selectedCategory, selectedBrand, minPrice, maxPrice]);

//   /*
//    * Sync filters with URL.
//    */
//   useEffect(() => {
//     const params = new URLSearchParams();

//     const search = debouncedSearch.trim();

//     if (search) {
//       params.set("search", search);
//     }

//     if (selectedCategory !== "ALL") {
//       params.set("category", selectedCategory);
//     }

//     if (selectedBrand !== "ALL") {
//       params.set("brand", selectedBrand);
//     }

//     if (minPrice) {
//       params.set("minPrice", minPrice);
//     }

//     if (maxPrice) {
//       params.set("maxPrice", maxPrice);
//     }

//     if (page > 1) {
//       params.set("page", String(page));
//     }

//     const query = params.toString();

//     router.replace(query ? `/products?${query}` : "/products", {
//       scroll: false,
//     });
//   }, [
//     debouncedSearch,
//     selectedCategory,
//     selectedBrand,
//     minPrice,
//     maxPrice,
//     page,
//     router,
//   ]);

//   const hasActiveFilters = useMemo(() => {
//     return Boolean(
//       debouncedSearch.trim() ||
//       selectedCategory !== "ALL" ||
//       selectedBrand !== "ALL" ||
//       minPrice ||
//       maxPrice,
//     );
//   }, [debouncedSearch, selectedCategory, selectedBrand, minPrice, maxPrice]);

//   const handleAddToCart = (product: CartItemInput) => {


//     dispatch(
//       addToCart({
//         id: product.id,
//         slug: product.slug,
//         name: product.name,
//         price: product.price,
//         image: product.image,
//         warrantyMonths: product.warrantyMonths,

//         // Cart expects string | undefined
//         brand: product.brand ?? undefined,
//         category: product.brand ?? undefined,
//         quantity: 1,
//         maxQuantity: product?.stockQuantity ?? 1,
//         stockQuantity: product?.stockQuantity ?? 1

//       }),
//     );

//     toast.success(`${product.name} added to cart`);
//   };

//   const resetFilters = () => {
//     setSearchTerm("");
//     setSelectedCategory("ALL");
//     setSelectedBrand("ALL");
//     setMinPrice("");
//     setMaxPrice("");
//     setPage(1);

//     router.replace("/products", {
//       scroll: false,
//     });
//   };

//   return (
//     <main className="min-h-screen bg-background">
//       {/* Hero */}
//       <section className="border-b border-border bg-muted/40">
//         <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
//           <div className="max-w-3xl">
//             <Badge
//               variant="outline"
//               className="rounded-full border-border bg-background px-3 py-1 text-xs font-bold"
//             >
//               Product Catalog
//             </Badge>

//             <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
//               Find the right products for your home
//             </h1>

//             <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
//               Explore genuine electrical products, appliances, fans, ACs, lights
//               and more. Search, filter and find exactly what you need.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Main */}
//       <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
//           {/* Filters */}
//           <aside className="lg:sticky lg:top-24 lg:self-start">
//             <Card className="rounded-2xl border-border bg-card shadow-sm">
//               <CardContent className="p-4 sm:p-5">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <SlidersHorizontal className="h-4 w-4 text-primary" />

//                     <h2 className="text-sm font-bold text-foreground">
//                       Filters
//                     </h2>
//                   </div>

//                   {hasActiveFilters && (
//                     <button
//                       type="button"
//                       onClick={resetFilters}
//                       className="text-xs font-semibold text-primary hover:underline"
//                     >
//                       Clear all
//                     </button>
//                   )}
//                 </div>

//                 <div className="mt-5 space-y-5">
//                   {/* Search */}
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="product-search"
//                       className="text-xs font-bold text-foreground"
//                     >
//                       Search
//                     </label>

//                     <div className="relative">
//                       <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

//                       <Input
//                         id="product-search"
//                         value={searchTerm}
//                         onChange={(event) => setSearchTerm(event.target.value)}
//                         placeholder="Search products..."
//                         className="h-11 rounded-xl pl-9 pr-9"
//                       />

//                       {searchTerm && (
//                         <button
//                           type="button"
//                           onClick={() => setSearchTerm("")}
//                           className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                           aria-label="Clear search"
//                         >
//                           <X className="h-4 w-4" />
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* Category */}
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="category"
//                       className="text-xs font-bold text-foreground"
//                     >
//                       Category
//                     </label>

//                     <select
//                       id="category"
//                       value={selectedCategory}
//                       onChange={(event) =>
//                         setSelectedCategory(event.target.value)
//                       }
//                       className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
//                     >
//                       <option value="ALL">All Categories</option>

//                       {categories.map((category) => (
//                         <option key={category.id} value={category.name}>
//                           {category.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Brand */}
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="brand"
//                       className="text-xs font-bold text-foreground"
//                     >
//                       Brand
//                     </label>

//                     <select
//                       id="brand"
//                       value={selectedBrand}
//                       onChange={(event) => setSelectedBrand(event.target.value)}
//                       className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
//                     >
//                       <option value="ALL">All Brands</option>

//                       {brands.map((brand) => (
//                         <option key={brand.id} value={brand.name}>
//                           {brand.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Price */}
//                   <div className="space-y-2">
//                     <label className="text-xs font-bold text-foreground">
//                       Price Range
//                     </label>

//                     <div className="grid grid-cols-2 gap-2">
//                       <Input
//                         value={minPrice}
//                         onChange={(event) => setMinPrice(event.target.value)}
//                         inputMode="numeric"
//                         placeholder="Min"
//                         className="h-11 rounded-xl"
//                       />

//                       <Input
//                         value={maxPrice}
//                         onChange={(event) => setMaxPrice(event.target.value)}
//                         inputMode="numeric"
//                         placeholder="Max"
//                         className="h-11 rounded-xl"
//                       />
//                     </div>
//                   </div>

//                   {/* Result count */}
//                   <div className="rounded-xl bg-muted/60 p-3">
//                     <p className="text-sm font-bold text-foreground">
//                       {totalItems.toLocaleString()} products
//                     </p>

//                     <p className="mt-0.5 text-xs text-muted-foreground">
//                       Available in our catalog
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </aside>

//           {/* Products */}
//           <div className="min-w-0">
//             {/* Toolbar */}
//             <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
//                     Products
//                   </h2>

//                   {isFetching && !isLoading && (
//                     <span className="text-xs font-medium text-muted-foreground">
//                       Updating...
//                     </span>
//                   )}
//                 </div>

//                 <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
//                   Page {page} of {totalPages}
//                 </p>
//               </div>

//               {hasActiveFilters && (
//                 <div className="flex flex-wrap gap-1.5">
//                   {selectedCategory !== "ALL" && (
//                     <Badge variant="outline" className="rounded-full">
//                       {selectedCategory}
//                     </Badge>
//                   )}

//                   {selectedBrand !== "ALL" && (
//                     <Badge variant="outline" className="rounded-full">
//                       {selectedBrand}
//                     </Badge>
//                   )}

//                   {debouncedSearch.trim() && (
//                     <Badge variant="outline" className="rounded-full">
//                       Search: {debouncedSearch.trim()}
//                     </Badge>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Loading */}
//             {isLoading ? (
//               <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
//                 {Array.from({ length: 6 }).map((_, index) => (
//                   <ProductSkeleton key={index} />
//                 ))}
//               </div>
//             ) : products.length === 0 ? (
//               <EmptyProductsState
//                 hasFilters={hasActiveFilters}
//                 onReset={resetFilters}
//               />
//             ) : (
//               <>
//                 <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
//                   {products.map((product) => (
//                     console.log(product),
//                     <MainProductCard
//                       key={product.id}
//                       product={product}
//                       onAddToCart={() => handleAddToCart(product)}
//                     />
//                   ))}
//                 </div>

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                   <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
//                     <p className="text-xs text-muted-foreground sm:text-sm">
//                       Page {page} of {totalPages}
//                     </p>

//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="rounded-xl"
//                         disabled={page <= 1 || isFetching}
//                         onClick={() =>
//                           setPage((current) => Math.max(1, current - 1))
//                         }
//                       >
//                         <ArrowLeft className="mr-1.5 h-4 w-4" />
//                         Previous
//                       </Button>

//                       <div className="flex h-9 min-w-9 items-center justify-center rounded-xl border border-border bg-card px-3 text-sm font-bold text-foreground">
//                         {page}
//                       </div>

//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="rounded-xl"
//                         disabled={page >= totalPages || isFetching}
//                         onClick={() =>
//                           setPage((current) =>
//                             Math.min(totalPages, current + 1),
//                           )
//                         }
//                       >
//                         Next
//                         <ArrowRight className="ml-1.5 h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Product Card                                                               */
// /* -------------------------------------------------------------------------- */

// interface ProductCardProps {
//   product: ProductItem;
//   onAddToCart: () => void;
// }

// function ProductCard({ product, onAddToCart }: ProductCardProps) {
//   const data = product.product;

//   const image = data.images?.[0] ?? "/images/product-placeholder.png";

//   const hasDiscount =
//     data.comparePrice != null && data.comparePrice > data.price;

//   const discountPercentage = hasDiscount
//     ? Math.round(((data.comparePrice! - data.price) / data.comparePrice!) * 100)
//     : 0;

//   const isInStock = data.stockQuantity > 0;

//   return (
//     <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 active:scale-[0.98] sm:hover:-translate-y-1 sm:hover:shadow-lg">
//       {/* Image */}
//       <Link
//         href={`/products/${data.slug}`}
//         className="block"
//         aria-label={`View ${data.name}`}
//       >
//         <div className="relative aspect-square overflow-hidden bg-muted">
//           <Image
//             src={image}
//             alt={data.name}
//             fill
//             sizes="(max-width: 639px) 50vw, (max-width: 1279px) 33vw, 300px"
//             className="object-cover transition-transform duration-500 group-hover:scale-105"
//           />
//           {/* 
//           // Discount
//           {hasDiscount && isInStock && (
//             <span className="absolute left-2.5 top-2.5 rounded-full bg-destructive px-2 py-1 text-[9px] font-bold text-destructive-foreground sm:left-3 sm:top-3 sm:text-[10px]">
//               -{discountPercentage}%
//             </span>
//           )} */}

//           {/* Out of stock */}
//           {!isInStock && (
//             <>
//               <div className="absolute inset-0 bg-background/60" />

//               <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-foreground px-2.5 py-1.5 text-[10px] font-bold text-background">
//                 Out of stock
//               </span>
//             </>
//           )}
//         </div>
//       </Link>

//       {/* Content */}
//       <div className="p-3 sm:p-4">
//         {/* Brand + Rating */}
//         {(data.brandId || data.attributes) && (
//           <div className="flex items-center justify-between gap-2">
//             {data.brandId ? (
//               <span className="truncate text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
//                 {data.brandId}
//               </span>
//             ) : (
//               <span />
//             )}
//           </div>
//         )}

//         {/* Product Name */}
//         <Link href={`/products/${data.slug}`}>
//           <h3 className="line-clamp-2 text-sm font-bold text-foreground transition-colors hover:text-primary">
//             {data.name}
//           </h3>
//         </Link>

//         {/* Warranty */}
//         {data.warrantyMonths > 0 && (
//           <p className="text-[10px] font-medium text-muted-foreground">
//             {data.warrantyMonths >= 12
//               ? `${Math.floor(data.warrantyMonths / 12)} Year Warranty`
//               : `${data.warrantyMonths} Month Warranty`}
//           </p>
//         )}

//         {/* Price */}
//         <div className="flex flex-wrap items-baseline gap-1.5">
//           <span className="text-base font-black tracking-tight text-foreground sm:text-lg">
//             {formatPrice(data.price)}
//           </span>

//           {hasDiscount && (
//             <del className="text-[10px] text-muted-foreground sm:text-xs">
//               {formatPrice(data.comparePrice!)}
//             </del>
//           )}

//           {hasDiscount && (
//             <p className="bg-green-100 text-green-400 px-2 py-1 rounded-xl inline-block text-xs">
//               Save {formatPrice(data.comparePrice! - data.price)}
//             </p>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
//           <Button
//             size="sm"
//             variant="outline"
//             disabled={!isInStock}
//             onClick={onAddToCart}
//             className="h-9 rounded-xl text-xs font-bold"
//           >
//             <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
//             Add
//           </Button>

//           <Link href={`/products/${data.slug}`}>
//             <Button size="sm" className="h-9 rounded-xl px-3 text-xs font-bold">
//               View
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </article>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Skeleton                                                                    */
// /* -------------------------------------------------------------------------- */

// function ProductSkeleton() {
//   return (
//     <div className="overflow-hidden rounded-2xl border border-border bg-card">
//       <div className="aspect-square animate-pulse bg-muted" />

//       <div className="space-y-3 p-3 sm:p-4">
//         <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />

//         <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />

//         <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />

//         <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />

//         <div className="h-9 w-full animate-pulse rounded-xl bg-muted" />
//       </div>
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Empty State                                                                 */
// /* -------------------------------------------------------------------------- */

// interface EmptyProductsStateProps {
//   hasFilters: boolean;
//   onReset: () => void;
// }

// function EmptyProductsState({ hasFilters, onReset }: EmptyProductsStateProps) {
//   return (
//     <Card className="rounded-2xl border-dashed border-border bg-card">
//       <CardContent className="flex flex-col items-center justify-center px-5 py-16 text-center">
//         <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
//           <Search className="h-6 w-6" />
//         </div>

//         <h3 className="mt-4 text-lg font-bold text-foreground">
//           No products found
//         </h3>

//         <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
//           {hasFilters
//             ? "Try changing your search or removing some filters."
//             : "There are no products available right now."}
//         </p>

//         {hasFilters && (
//           <Button onClick={onReset} className="mt-5 rounded-xl">
//             Clear Filters
//           </Button>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
