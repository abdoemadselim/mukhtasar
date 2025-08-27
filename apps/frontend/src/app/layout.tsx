import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import "@/app/globals.css";
import { cairo } from "@/app/fonts";

import { ClientProvider } from "@/context/client-provider";
import { Toaster } from "@/components/ui/sonner";

import { AuthProvider } from "@/features/auth/context/auth-context";
import { UrlProvider } from "@/features/url/context/urls-context";

export const metadata: Metadata = {
  title: "مُختصِر | أول منتج عربي متكامل لإختصار الروابط",
  description: "مُختصِر هو أول منتج عربي لإختصار الروابط، يوفر أدوات متكاملة لإدارة الروابط بسهولة وكفاءة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.className} antialiased `}
      >
        <ClientProvider>
          <AuthProvider>
            <UrlProvider>
              {children}
              {/* <SpeedInsights /> */}
              {/* <Analytics /> */}
            </UrlProvider>
          </AuthProvider>
          <Toaster position="top-right" richColors />
        </ClientProvider>
      </body>
    </html>
  );
}
