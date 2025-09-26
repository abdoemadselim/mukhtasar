import Image from "next/image";
import { BadgeQuestionMark } from "lucide-react";

import HeroSection from "@/components/layout/hero-section";
import { Highlighter } from "@/components/ui/highlighter";
import AnalyticsShowcaseSection from "@/features/analytics/components/analytics-showcase-section";
import ContactUs from "@/features/contact/components/contact-us";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <section className="text-center pb-50 pt-15 mt-38 relative mx-auto bg-white">
        <h2 className="text-4xl lg:text-5xl font-bold mb-4">
          <Highlighter action="underline" strokeWidth={2} color="red">
            <BadgeQuestionMark className="inline-block ml-2 mb-1" size={42} />
            لماذا تختصر  مع مُختصِر
          </Highlighter>
        </h2>

        <div className="flex flex-col lg:flex-row gap-10 items-center justify-center mt-20 px-6">

          <div className="sm:text-2xl lg:text-3xl text-xl parent flex justify-center flex-col items-center max-w-[550px] text-gray-800 bg-gray-100 rounded-2xl p-5 py-6 hover:bg-gray-200">
            <Image
              src="/customer.png"
              alt="Customer icon"
              width={80}
              height={80}
            />
            <p>تخيّل لو استطعت قراءة عقول جمهورك!<span className="text-[1rem] block pt-1">(حسناً - فقط الجزء الخاص بك)</span></p>
            <p className="sm:text-[1.3rem] text-[1rem] text-gray-600 mt-3">
              نُقدم لك فى مُختصِر إحصائيات دقيقة لكل رابط تُساعدك على فهم كامل لزوارك
            </p>
          </div>

          <div className="sm:text-2xl lg:text-3xl text-xl flex justify-center flex-col items-center max-w-[550px] text-gray-800 bg-gray-100 rounded-2xl p-5 py-6 hover:bg-gray-200">
            <Image
              src="/slider.png"
              alt="Slider icon"
              width={100}
              height={100}
            />
            ادفع فقط على قدر احتياجك وأكبر معنا
            <p className="sm:text-[1.3rem] text-[1rem] text-gray-600 mt-3">مع مخُتصِر أنت تختار (فقط) ما تحتاج</p>
          </div>

        </div>
      </section>

      <AnalyticsShowcaseSection />
      <ContactUs />
    </main>
  )
}
