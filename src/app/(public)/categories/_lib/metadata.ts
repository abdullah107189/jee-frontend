import type { Metadata } from "next";

export async function buildCategoryMetadata(
  categoryName: string,
  description: string | null,
  fullSlug: string,
): Promise<Metadata> {
  const title = `${categoryName} — JEE Store`;
  const desc =
    description ||
    `Shop ${categoryName} in Bangladesh. Authentic products with warranty from JEE Store.`;

  const url = `https://jeestore.com/categories/${fullSlug}`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url,
      siteName: "JEE Store",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}