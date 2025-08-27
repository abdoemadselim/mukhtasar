import Image from "next/image";
import dynamic from "next/dynamic";

import LandingUrlCreationForm from "@/features/url/components/landing-url-creation-form";

const SparklesText = dynamic(() => import("@/components/ui/sparkles-text").then((comp) => comp.SparklesText))
const AnimatedGradientText = dynamic(() => import("@/components/ui/animated-gradient-text"))

export default function HeroSection() {
    return (
        <section className="flex flex-col justify-center items-center pb-20 pt-6">
            <header className="text-center ">
                <div className="flex justify-center items-center gap-4">
                    <SparklesText>
                        <Image
                            src="/logo-lg.webp"
                            alt="مختصر"
                            width="210"
                            height="84"
                            priority
                        />
                    </SparklesText>
                </div>
                <AnimatedGradientText text="أول منتج عربي متكامل لإختصار الروابط" />

                <div className="pt-4 min-h-[100px] md:min-h-[120px] flex items-start justify-center">
                    <p className="text-base md:text-lg lg:text-xl md:max-w-[770px] max-w-[500px] text-muted-foreground leading-relaxed">
                        حوّل روابطك الطويلة إلى روابط قصيرة
                        تمنح مستخدميك تجربة أسهل وأجمل، مع إحصائيات دقيقة تساعدك على فهم تفاعلهم بشكل أفضل.
                    </p>
                </div>
            </header>
            <LandingUrlCreationForm />
        </section>
    )
}