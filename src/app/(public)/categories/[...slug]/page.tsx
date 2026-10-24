import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
    getCategoryProducts,
    getCategoryFilters,
} from "@/services/category.service";
import { buildCategoryMetadata } from "../_lib/metadata";
import { parseCategorySearchParams } from "../_lib/params";
import { CategoryBreadcrumb } from "@/components/modules/(public)/categories/breadcrumb";
import { CategoryHeader } from "@/components/modules/(public)/categories/category-header";
import { EmptyCategory } from "@/components/modules/(public)/categories/empty-category";
import { ProductListingClient } from "@/components/modules/(public)/categories/product-listing-client";

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

    const queryFilters: Record<string, string | undefined> = {
        brandId: parsed.brand,
        minPrice: parsed.minPrice,
        maxPrice: parsed.maxPrice,
        warrantyMonths: parsed.warrantyMonths,
        sortBy: parsed.sort, // ← sort → sortBy
        page: parsed.page.toString(),
        ...parsed.filter,
    };

    const [data, filtersData] = await Promise.all([
        getCategoryProducts(parsed.slug, queryFilters),
        getCategoryFilters(parsed.slug),
    ]);
    if (!data?.category) notFound();
    console.log("data", data);

    const hasActiveFilters = !!(
        parsed.brand ||
        parsed.minPrice ||
        parsed.maxPrice ||
        parsed.warrantyMonths ||
        parsed.sort ||
        Object.keys(parsed.filter).length > 0
    );

    const isEmpty = data.products.length === 0 && !hasActiveFilters;

    return (
        <main className="mxw py-5!">
            <CategoryBreadcrumb breadcrumb={data.breadcrumb} />

            {/* <CategoryHeader
                name={data.category.name}
                description={data.category.description}
                productCount={data.total}
            /> */}

            {isEmpty ? (
                <EmptyCategory category={data.category} siblings={data.siblings} />
            ) : (
                <ProductListingClient
                    products={data.products}
                    total={data.total}
                    page={data.page}
                    limit={data.limit}
                    totalPages={data.totalPages}
                    categorySlug={parsed.slug}
                    filters={filtersData?.filters ?? []}
                    lowestPrice={filtersData?.lowestPrice ?? 0}
                    highestPrice={filtersData?.highestPrice ?? 0}
                    initialFilters={{
                        brand: parsed.brand,
                        minPrice: parsed.minPrice,
                        maxPrice: parsed.maxPrice,
                        warrantyMonths: parsed.warrantyMonths,
                        sort: parsed.sort,
                        filter: parsed.filter,
                    }}
                />
            )}
        </main>
    );
}