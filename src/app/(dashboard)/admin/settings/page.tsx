import type { Metadata } from "next";
import SettingsContent from "@/components/modules/admin/settings/SettingsContent";
import { getSystemSettings } from "@/services/admin.service";

export const metadata: Metadata = {
  title: "Settings | JEE Admin",
  description: "Platform configuration, payment options, and warranty rules.",
};

export default async function AdminSettingsPage() {
  const settings = await getSystemSettings();

  return <SettingsContent initialSettings={settings} />;
}
