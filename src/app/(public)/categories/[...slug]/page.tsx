import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryProducts } from "@/services/category.service";
import { buildCategoryMetadata } from "../_lib/metadata";
import { parseCategorySearchParams } from "../_lib/params";
import { CategoryBreadcrumb } from "@/components/modules/(public)/categories/breadcrumb";
import { CategoryHeader } from "@/components/modules/(public)/categories/category-header";
import { EmptyCategory } from "@/components/modules/(public)/categories/empty-category";
import { ProductListing } from "@/components/modules/(public)/categories/product-listing";

interface CategoryPageProps {
    params: Promise<{ slug: string[] }>;
    searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({
    params,
}: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const fullSlug = slug.join("/");

    const data = await getCategoryProducts(fullSlug);
    if (!data?.category) {
        return { title: "Category Not Found — JEE Store" };
    }

    return buildCategoryMetadata(
        data.category.name,
        data.category.description,
        data.category.fullSlug,
    );
}

export default async function CategoryPage({
    params,
    searchParams,
}: CategoryPageProps) {
    const { slug } = await params;
    const parsed = await parseCategorySearchParams(slug, searchParams);

    const data = await getCategoryProducts(parsed.slug, {
        brand: parsed.brand,
        minPrice: parsed.minPrice,
        maxPrice: parsed.maxPrice,
        warrantyMonths: parsed.warrantyMonths,
        sort: parsed.sort,
        page: parsed.page.toString(),
    });

    if (!data?.category) {
        notFound();
    }

    const hasActiveFilters = !!(
        parsed.brand ||
        parsed.minPrice ||
        parsed.maxPrice ||
        parsed.warrantyMonths ||
        parsed.sort
    );

    const isEmpty = data.products.length === 0 && !hasActiveFilters; 
    return (
        <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <CategoryBreadcrumb breadcrumb={data.breadcrumb} />

            <CategoryHeader
                name={data.category.name}
                description={data.category.description}
                productCount={data.total}
            />

            {isEmpty ? (
                <EmptyCategory
                    category={data.category}
                    siblings={data.siblings}
                />
            ) : (
                <ProductListing
                    products={data.products}
                    total={data.total}
                    page={data.page}
                    limit={data.limit}
                    totalPages={data.totalPages}
                    categorySlug={parsed.slug}
                />
            )}
        </main>
    );
}