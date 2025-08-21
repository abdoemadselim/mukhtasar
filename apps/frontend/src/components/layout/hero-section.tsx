import Image from "next/image";
import { SparklesText } from "@/components/ui/sparkles-text";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";

export default function HeroSection() {
    return (
        <section className="flex flex-col justify-center items-center mt-20">
            <header className="text-center pb-8">
                <div className="flex justify-center items-center gap-4 ">
                    <SparklesText>
                        <Image
                            src="/logo-lg.png"
                            alt="مختصر"
                            width="210"
                            height="84"
                        />
                    </SparklesText>
                </div>
                <AnimatedGradientText text="أول منتج عربي متكامل لإختصار الروابط" />

                <p className="text-xl md:max-w-[770px] max-w-[500px] pt-4 text-muted-foreground">
                    حوّل روابطك الطويلة إلى روابط  قصيرة
                    وأنيقة تمنح مستخدميك تجربة أسهل وأجمل، مع إحصائيات دقيقة تساعدك على فهم تفاعلهم بشكل أفضل.
                </p>
            </header>
            <section className=" relative bg-white p-6 border-2 sm:w-[70vw] xl:w-[38vw] w-[80vw] rounded-lg">
                <div className="pb-8">
                    <Label htmlFor="original_url" className="pb-3 text-lg">ادخل رابطك الطويل هنا</Label>
                    <Input type="text" id="original_url" className="text-end h-[45px] border-gray-300" name="original_url" placeholder="http://example.com/very-long-url"></Input>
                </div>

                <div>
                    <p className="pb-3 text-lg">خصص رابطك</p>
                    <div className="flex items-center gap-4 md:w-[80%] w-full">
                        <div className="w-full">
                            <Label htmlFor="alias" className="text-muted-foreground pb-3">الاسم المستعار</Label>
                            <Input type="text" id="alias" className="text-end border-gray-300 w-full" name="alias" placeholder="products"></Input>
                        </div>

                        <div className="w-full">
                            <Label htmlFor="domain" className="text-muted-foreground pb-3">الدومين</Label>
                            <Select name="domain">
                                <SelectTrigger className="w-full border-gray-300">
                                    <SelectValue placeholder="light" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <Button className="mt-20 cursor-pointer w-full text-2xl py-4 h-12 ">قصر رابطك مجاناً</Button>
            </section>
        </section>
    )
}