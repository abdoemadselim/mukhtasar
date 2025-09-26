import Image from "next/image";
import dynamic from "next/dynamic";

import Highlighter from '@/components/ui/highlighter'
import AnimatedGradientText from "@/components/ui/animated-gradient-text"

import LandingUrlCreationForm from "@/features/url/components/landing-url-creation-form";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="pt-10">
            <header className="text-center mb-2 flex flex-col justify-center items-center">
                <div className="flex justify-center items-center gap-4">
                    <Image
                        src="/logo-lg.webp"
                        alt="مختصر"
                        width="210"
                        height="84"
                        priority
                    />
                </div>
                <AnimatedGradientText text="أول منتج عربي متكامل لإختصار الروابط" />
                <div className="text-xl sm:text-2xl lg:text-3xl md:max-w-[1000px] max-w-[530px] leading-relaxed px-4 pt-8">
                    فهم أعمق لزوار موقعك = استهداف أدق  =
                    <Highlighter strokeWidth={2} color="#22C55E">نمو أسرع لشركتك!</Highlighter>
                    <p className="text-base md:text-md lg:text-xl text-muted-foreground leading-relaxed hidden sm:block">مع إحصائيات مُختصِر الدقيقة: نوع الجهاز، الدولة، المتصفح، مصدر الزيارة،
                        <Link href="#more-analytics" className="underline text-blue-400"> وأكثر.</Link></p>

                    <p className="pt-4 hidden sm:block"> كل روابطك تتكلم عنك</p>
                    <p className="text-base hidden sm:block md:text-md lg:text-xl text-muted-foreground leading-relaxed mb-4">مع روابط قصيرة معبرة تحمل نطاق موقعك</p>
                </div>
            </header>

            <LandingUrlCreationForm />
        </section>
    )
}