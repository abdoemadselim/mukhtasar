import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";

import AnimatedGradientText from "@/shared/components/ui/animated-gradient-text"
import { Highlight } from "@/shared/components/ui/hero-highlight";

import LandingUrlCreationForm from "@/features/url/components/landing-url-creation-form";

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
                <div className="text-xl sm:text-2xl lg:text-4xl font-semibold tracking-tight text-slate-900 md:max-w-[1000px] max-w-[530px] leading-snug px-4 pt-8 text-balance">
                    فهم أعمق لزوار موقعك = استهداف أدق  =
                    <Highlight>نمو أسرع لشركتك!</Highlight>
                    <p className="text-base md:text-md mt-3 lg:text-xl font-normal tracking-normal text-muted-foreground leading-relaxed hidden sm:block">مع إحصائيات مُختصِر الدقيقة: نوع الجهاز، الدولة، المتصفح، مصدر الزيارة،
                        <Link href="#more-analytics" className="underline text-blue-400"> وأكثر.</Link></p>

                    <p className="pt-6 hidden sm:block"> كل روابطك تتكلم عنك</p>
                    <p className="text-base hidden sm:block md:text-md lg:text-xl font-normal tracking-normal text-muted-foreground leading-relaxed mb-6">مع روابط قصيرة معبرة تحمل نطاق موقعك</p>
                </div>
            </header>

            <LandingUrlCreationForm />
        </section>
    )
}