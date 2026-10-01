import type { Metadata } from "next";
import { getAllFilterGroups } from "@/services/filter.service";
import { FiltersList } from "@/components/modules/admin/filters/filters-list";

export const metadata: Metadata = {
  title: "Filters | JEE Admin",
  description: "Manage category filters",
};

export default async function AdminFiltersPage() {
  const groups = await getAllFilterGroups();

  return <FiltersList groups={groups} />;
}