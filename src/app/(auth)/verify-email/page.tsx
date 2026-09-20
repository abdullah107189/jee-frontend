import { Suspense } from "react";
import { redirect } from "next/navigation"; 
import { VerifyEmailForm } from "@/components/modules/auth/verifyEmailForm/verify-email-form";
import { auth } from "@/lib/auth/session";

export const metadata = { title: "Verify Email — JEE" };

export default async function VerifyEmailPage() {
  const user = await auth();
  if (user) redirect("/");

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-background to-primary/5 px-4 py-12">
      <Suspense fallback={null}>
        <VerifyEmailForm/>
      </Suspense>
    </main>
  );
}