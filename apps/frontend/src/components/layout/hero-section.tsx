import Image from "next/image";
import dynamic from "next/dynamic";

import LandingUrlCreationForm from "@/features/url/components/landing-url-creation-form";

const SparklesText = dynamic(() => import("@/components/ui/sparkles-text").then((comp) => comp.SparklesText))
const AnimatedGradientText = dynamic(() => import("@/components/ui/animated-gradient-text"))

export default function HeroSection() {
    return (
        <section className="flex flex-col justify-center items-center pb-10 pt-30">
            <header className="text-center mb-4">
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

                <div className="pt-10 min-h-[100px] md:min-h-[120px] flex items-start justify-center">
                    <p className="text-lg md:text-2xl lg:text-3xl md:max-w-[1000px] max-w-[530px] leading-relaxed px-4">
                        فهم أعمق لعملائك = استهداف أدق = نمو أسرع لشركتك!
                        <p className="text-base md:text-md lg:text-xl text-muted-foreground leading-relaxed hidden sm:block">مع إحصاءات مُختصِر الدقيقة: نوع الجهاز، الدولة، المتصفح، مصدر الزيارة، وأكثر.</p>

                        <p className="pt-4"> كل روابطك تتكلم عنك</p>
                        <p className="text-base md:text-md lg:text-xl text-muted-foreground leading-relaxed mb-4">مع روابط قصيرة معبرة تحمل نطاق موقعك</p>
                    </p>
                </div>
            </header>
            <LandingUrlCreationForm />
        </section>
    )
}