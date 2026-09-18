"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/Card";
import { verifyEmailAction, resendOtpAction } from "@/actions/auth.actions";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export function VerifyEmailForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        if (!email) router.replace("/register");
    }, [email, router]);

    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setInterval(() => setCooldown((c) => c - 1), 1000);
        return () => clearInterval(t);
    }, [cooldown]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;
        const next = [...otp];
        next[index] = value;
        setOtp(next);
        if (value && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!text) return;
        e.preventDefault();
        const next = Array(OTP_LENGTH).fill("");
        text.split("").forEach((c, i) => (next[i] = c));
        setOtp(next);
        inputsRef.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
    };

    const handleVerify = async () => {
        const code = otp.join("");
        if (code.length !== OTP_LENGTH) {
            toast.error("Please enter the 6-digit OTP");
            return;
        }

        setIsVerifying(true);
        try {
            const fd = new FormData();
            fd.set("email", email);
            fd.set("otp", code);

            const res = await verifyEmailAction(null, fd);

            if (!res.success) {
                toast.error(res.message);
                return;
            }

            toast.success("Email verified! Please login.");
            router.push("/login?verified=true");
        } catch {
            toast.error("Network error");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;

        setIsResending(true);
        try {
            const fd = new FormData();
            fd.set("email", email);

            const res = await resendOtpAction(null, fd);

            if (!res.success) {
                toast.error(res.message);
                return;
            }

            toast.success("New OTP sent to your email");
            setCooldown(RESEND_COOLDOWN);
            setOtp(Array(OTP_LENGTH).fill(""));
            inputsRef.current[0]?.focus();
        } catch {
            toast.error("Network error");
        } finally {
            setIsResending(false);
        }
    };

    if (!email) return null;

    return (
        <Card className="w-full max-w-md border-border/50 bg-card/80 shadow-2xl backdrop-blur-xl">
            <CardHeader className="space-y-2 text-center">
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <ShieldCheck className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>

            </CardHeader>

            <CardContent className="space-y-6">
                <div className="flex justify-center gap-2">
                    {otp.map((digit, i) => (
                        <input
                            key={i}
                            ref={(el) => { inputsRef.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            onPaste={handlePaste}
                            className="h-12 w-11 rounded-lg border border-border bg-background text-center text-lg font-semibold shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                            autoFocus={i === 0}
                        />
                    ))}
                </div>

                <Button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="h-11 w-full rounded-xl"
                >
                    {isVerifying ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        <>
                            Verify Email
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                    Didn't receive the code?{" "}
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending || cooldown > 0}
                        className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isResending ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                    </button>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                    Wrong email?{" "}
                    <Link href="/register" className="font-medium text-primary hover:underline">
                        Change it
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}