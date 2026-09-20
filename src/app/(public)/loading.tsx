import Image from "next/image";

export default function Loading() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-background">
            <Image
                src="/JEE.png"
                alt="JEE Logo"
                width={400}
                height={400}
                className="h-auto w-20"
                priority
            />
        </main>
    );
}
