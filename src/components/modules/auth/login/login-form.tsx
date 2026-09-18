"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { loginSchema, type LoginFormValues } from "@/lib/auth/schema";
import { loginAction } from "@/actions/auth.actions";
import { roleDashboard } from "@/lib/auth/role";

const ROLE_PATH: Record<string, string> = {
  ADMIN: "/admin",
  SELLER: "/seller",
  CUSTOMER: "/customer",
  admin: "/admin",
  seller: "/seller",
  customer: "/customer",
};
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "";
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast.success("Email verified! Please login.");
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsPending(true);

    try {
      const fd = new FormData();
      fd.set("email", data.email);
      fd.set("password", data.password);

      const res = await loginAction(null, fd);

      if (!res.success || !res.user) {
        toast.error(res.message);
        setIsPending(false);
        return;
      }

      const defaultPath = roleDashboard(res.user.role);

      // ✅ Only honor redirect if it belongs to the user's role
      const isRedirectValid = redirectTo.startsWith(defaultPath);
      const targetPath = isRedirectValid ? redirectTo : defaultPath;

      toast.success(`Welcome back, ${res.user.name}!`);

      // Hard navigation → fresh server state
      window.location.href = targetPath;
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-border/50 bg-card/80 shadow-2xl backdrop-blur-xl">
      <CardHeader className="space-y-2 text-center">
        <Link href="/" className="flex items-center justify-center gap-2.5 group shrink-0 p-1">
          <Image src="/JEE.png" alt="JEE Logo" width={100} height={200} className="w-25 h-auto" />
        </Link>
        <CardTitle className="text-2xl font-bold sm:text-3xl">Welcome back</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="h-11 pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="h-11 pl-10 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}