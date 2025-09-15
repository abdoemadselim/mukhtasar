import Image from "next/image";

import HeroSection from "@/components/layout/hero-section";
import dynamic from "next/dynamic";
import { BadgeQuestionMark, Banknote, Brain, Package, Sparkle } from "lucide-react";

const Highlighter = dynamic(() => import('@/components/ui/highlighter').then((comp) => comp.Highlighter))

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <section className="text-center pb-20 pt-10 mt-60 relative mx-auto bg-white">
        <h2 className="lg:text-4xl text-3xl font-bold mb-4">
          <Highlighter action="underline" strokeWidth={6} color="#ccc">
            <BadgeQuestionMark size={40} />
            لماذا تختصر  مع مُختصِر
          </Highlighter>
        </h2>

        <div className="flex flex-col lg:flex-row gap-10 items-center justify-center mt-20 px-6">

          <div className="sm:text-2xl lg:text-3xl text-xl flex justify-center flex-col items-center max-w-[550px] text-gray-800 bg-gray-100 rounded-2xl p-3">
            <Image
              src="/customer.png"
              alt="Customer icon"
              width={80}
              height={80}
            />
            <p>تخيّل لو استطعت قراءة عقول عملائك!<span className="text-[1rem] block pt-1">(حسناً - فقط الجزء الخاص بك)</span></p>
            <p className="sm:text-[1.3rem] text-[1rem] text-gray-600 mt-3">
              نُقدم لك فى مُختصِر إحصاءات دقيقة لكل رابط تُساعدك على فهم كامل لزوارك
            </p>
          </div>

          <div className="sm:text-2xl lg:text-3xl text-xl flex justify-center flex-col items-center max-w-[550px] text-gray-800 bg-gray-100 rounded-2xl p-3">
            <Image
              src="/slider.png"
              alt="Slider icon"
              width={100}
              height={100}
            />
            ادفع فقط على قدر احتياجك وأكبر معنا
            <p className="sm:text-[1.3rem] text-[1rem] text-gray-600 mt-3">مقابل 1$ فقط تحصل على جميع خدمات مُختصِر!</p>
          </div>

        </div>
      </section>
    </>
  )
}
