import { redirect } from "next/navigation";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

import { getSession } from "@/features/auth/service/auth-session";

export default async function NavLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getSession()
    if (session?.data.user && session?.data.user.verified) {
        redirect("/dashboard/urls")
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
