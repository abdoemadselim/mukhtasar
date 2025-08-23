import { MessageCircleQuestionMark } from "lucide-react";

import { Highlighter } from "@/components/ui/highlighter";

export default function WhyShortUrls() {
    return (
        <section className="pt-20 max-w-[80vw] mx-auto">
            <header className="flex gap-2">
                <Highlighter color="#F2575A" action="underline"><h2 className="text-2xl">لماذا تقصر روابطك الطويلة</h2></Highlighter>
                <MessageCircleQuestionMark className="text-primary" />
            </header>
            <p className="pt-4 pb-4">حاول أن تنسخ الرابط الطويل بالأسفل</p>
            <p className="w-[700px] p-2 border-2 border-amber-300 break-words">
                https://www.example.com/products/category/electronics/mobile-phones/samsung-galaxy-s24-ultra?utm_source=newsletter&utm_medium=email&utm_campaign=summer_sale_2025&utm_content=header_banner&ref=homepage&sort=popularity&filter=color%3Dblack%26memory%3D512GB%26warranty%3Dextended&session_id=abc123xyz789&user_id=4578392&tracking_id=trk-2025-long-url-test
            </p>
        </section>
    )
}