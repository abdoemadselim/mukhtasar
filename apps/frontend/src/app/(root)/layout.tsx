import { redirect } from "next/navigation";

import Navbar from "@/components/layout/navbar";
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
        <>
            <Navbar />
            {children}
        </>
    );
}
