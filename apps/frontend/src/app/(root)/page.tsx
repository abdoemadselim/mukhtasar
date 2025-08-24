import Image from "next/image";

import HeroSection from "@/components/layout/hero-section";
import dynamic from "next/dynamic";

const Highlighter  = dynamic(() => import('@/components/ui/highlighter').then((comp) => comp.Highlighter))

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <section className="text-center pb-20 pt-8 relative max-w-[90vw] mx-auto">
        <h2 className="lg:text-4xl text-3xl font-bold mb-4">
          <Highlighter action="underline" strokeWidth={6} color="#ccc">
            لماذا تختصر  مع مُختصِر
          </Highlighter>
        </h2>
        <div className="flex justify-center items-center">
          <div className="text-gray-600 lg:text-2xl text-xl">
            مع خدمتنا، التحويل بين الرابط المختصر والأصلي يتم في أجزاء من الثانية..

            <p>زوّارك لن هيلاحظوا أنه في إعادة توجيه حتى.</p>
          </div>
          <Image
            src="/flash.png"
            alt="Flash icon"
            width="150"
            height="150"
            className="absolute opacity-12 top-[30px]"
          />
        </div>
      </section>
    </>
  )
}
