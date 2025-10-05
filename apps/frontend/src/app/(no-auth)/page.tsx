import Image from "next/image";
import { BadgeQuestionMark } from "lucide-react";
import dynamic from "next/dynamic";

import HeroSection from "@/shared/components/layout/hero-section";
import WobbleCard from "@/shared/components/ui/wobble-card";
const Highlighter = dynamic(() => import('@/shared/components/ui/highlighter'))

const AnalyticsShowcaseSection = dynamic(() => import("@/features/analytics/components/analytics-showcase-section"));
const ContactUs = dynamic(() => import("@/features/contact/components/contact-us"))

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <section className="text-center pb-40 pt-30 mt-38 relative mx-auto bg-white">
        <h2 className="text-3xl lg:text-5xl font-bold mb-4">
          <Highlighter action="underline" strokeWidth={2} color="red">
            <BadgeQuestionMark className="inline-block ml-2 mb-1" size={42} />
            لماذا تختصر  مع مُختصِر
          </Highlighter>
        </h2>

        <div className="flex flex-col lg:flex-row gap-15 items-center justify-center mt-20 px-6">
          <WobbleCard className="py-10" containerClassName="xl:w-[700px] md:w-[600px] w-[90vw] bg-indigo-200">
            <div className="sm:text-2xl lg:text-4xl text-xl parent flex justify-center flex-col items-center">
              <Image
                src="/customer.png"
                alt="Customer icon"
                width={80}
                height={80}
              />
              <p className="text-gray-800 ">تخيّل لو استطعت قراءة عقول جمهورك!<span className="text-[1rem] block pt-1">(حسناً - فقط الجزء الخاص بك)</span></p>
              <p className="sm:text-[1.3rem] text-[1rem] text-gray-600 mt-3">
                نُقدم لك فى مُختصِر إحصائيات دقيقة لكل رابط تُساعدك على فهم كامل لزوارك
              </p>
            </div>
          </WobbleCard>

          <WobbleCard className="py-10" containerClassName="xl:w-[700px] md:w-[600px] w-[90vw] bg-pink-200">
            <div className="sm:text-2xl lg:text-4xl text-xl parent flex justify-center flex-col items-center">
              <Image
                src="/slider.png"
                alt="Slider icon"
                width={100}
                height={100}
              />
              <p className="text-gray-800">ادفع فقط على قدر احتياجك وأكبر معنا</p>
              <p className="sm:text-[1.3rem] text-[1rem] text-gray-600 mt-3">مع مخُتصِر أنت تختار (فقط) ما تحتاج</p>
            </div>
          </WobbleCard>
        </div>
      </section >

      <AnalyticsShowcaseSection />
      <ContactUs />
    </main >
  )
}
