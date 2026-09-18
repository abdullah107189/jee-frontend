import Footer from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { auth } from "@/lib/auth/session";


export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await auth();  // cached, 0 extra API call
    console.log("PUBLIC LAYOUT USER:", user);
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar user={user} />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}