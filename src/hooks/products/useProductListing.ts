"use client";

import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useProductListing() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const updateURL = useCallback(
    (
      updates: Record<string, string | null>,
      resetPage = true,
    ) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      if (resetPage) {
        params.set("page", "1");
      }

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      });
    },
    [pathname, router, searchParams],
  );

  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.replace(pathname, {
        scroll: false,
      });
    });
  }, [pathname, router]);

  const changePage = useCallback(
    (page: number) => {
      if (page < 1) return;

      updateURL(
        {
          page: page === 1 ? null : String(page),
        },
        false,
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [updateURL],
  );

  return {
    isPending,
    updateURL,
    clearFilters,
    changePage,
  };
}
