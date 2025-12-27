import { Link } from "lucide-react"
import { useFormContext } from "react-hook-form"

import { DomainType } from "@/features/domain/types"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Input } from "@/shared/components/ui/input"

interface ShortLinkSectionProps {
    activeDomains?: { domains: DomainType[] }
    stepNumber: number
}

export default function ShortLinkSection({
    activeDomains,
    stepNumber
}: ShortLinkSectionProps) {
    const { control } = useFormContext()
    return (
        <section className="bg-white p-4 rounded-lg relative">
            <span className="bg-primary text-white w-7 h-7 flex items-center justify-center font-bold text-center p-4 rounded-full text-xl absolute top-[-17px] right-[-10px] border-1">
                {stepNumber}
            </span>

            <div className="text-xl pb-4 flex items-center gap-3">
                <Link color="red" />
                <p>الرابط القصير</p>
            </div>

            <div className="flex flex-col gap-4">
                {/* Domain */}
                <FormField
                    control={control}
                    name="domain"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-md">النطاق</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2">
                                        <SelectValue placeholder="اختر نطاق" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="mukhtasar.pro">
                                        mukhtasar.pro (افتراضي)
                                    </SelectItem>
                                    {activeDomains?.domains?.map((domain: DomainType) => (
                                        <SelectItem key={domain.id} value={domain.domain}>
                                            {domain.domain}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Alias */}
                <FormField
                    control={control}
                    name="alias"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-md">الاسم المستعار (اختياري)</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2"
                                    placeholder="my-qr-code"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </section>
    )
}
