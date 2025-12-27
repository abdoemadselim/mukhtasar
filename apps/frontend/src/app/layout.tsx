import type { Metadata } from "next";
import "@/app/globals.css";
import { cairo } from "@/fonts";

import { ClientProvider } from "@/shared/context/client-provider";
import { Toaster } from "@/shared/components/ui/sonner";

export const metadata: Metadata = {
  title: "مُختصِر | أول منتج عربي متكامل لإختصار الروابط",
  description:
    "مُختصِر هو أول منتج عربي لإختصار الروابط، يوفر أدوات متكاملة لإدارة الروابط بسهولة وكفاءة.",
  keywords: [
    "مُختصِر",
    "اختصار الروابط",
    "short url",
    "روابط قصيرة",
    "URL Shortener",
    "bitly بديل عربي",
  ],
  applicationName: "مُختصِر",
  authors: [{ name: "Abdelrahman Emad", url: "https://github.com/abdoemadselim" }],
  creator: "Abdelrahman Emad",
  publisher: "مُختصِر",
  metadataBase: new URL("https://mukhtasar.pro"),
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://mukhtasar.pro",
    title: "مُختصِر | أول منتج عربي متكامل لإختصار الروابط",
    description:
      "مُختصِر هو أول منتج عربي لإختصار الروابط، يوفر أدوات متكاملة لإدارة الروابط بسهولة وكفاءة.",
    siteName: "مُختصِر",
    images: [
      {
        url: "/logo-lg.webp",
        width: 1200,
        height: 630,
        alt: "مُختصِر - اختصار الروابط",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "مُختصِر | أول منتج عربي متكامل لإختصار الروابط",
    description:
      "مُختصِر هو أول منتج عربي لإختصار الروابط، يوفر أدوات متكاملة لإدارة الروابط بسهولة وكفاءة.",
    creator: "@your_twitter_handle",
    images: ["/logo-lg.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://api.mukhtasar.pro" />
      </head>
      <body
        className={`${cairo.className} antialiased `}
      >
        <ClientProvider>
          {children}
          <Toaster position="top-center" richColors />
        </ClientProvider>
      </body>
    </html>
  );
}
