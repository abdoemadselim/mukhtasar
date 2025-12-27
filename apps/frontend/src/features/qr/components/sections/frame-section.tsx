import { Link } from "lucide-react"
import { useFormContext, useWatch } from "react-hook-form"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Input } from "@/shared/components/ui/input"

import DebouncedColorPicker from "@/features/qr/components/ui/debounce-color-picker"

interface FrameSectionProps {
    stepNumber: number
}

export default function FrameSection({ stepNumber }: FrameSectionProps) {
    const { control } = useFormContext()
    const frameType = useWatch({ name: "frame_type" })
    return (
        <section className="bg-white p-4 rounded-lg flex flex-col gap-3 relative">
            <span className="bg-primary text-white w-7 h-7 flex items-center justify-center font-bold text-center p-4 rounded-full text-xl absolute top-[-17px] right-[-10px] border-1">
                {stepNumber}
            </span>

            <div className="text-xl pb-4 flex items-center gap-3">
                <Link color="red" />
                <p>الإطار</p>
            </div>

            <FormField
                control={control}
                name="frame_type"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-md">نوع الإطار</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                            <FormControl>
                                <SelectTrigger className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2 w-full">
                                    <SelectValue />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="none">بدون إطار</SelectItem>
                                <SelectItem value="frame_only">إطار فقط</SelectItem>
                                <SelectItem value="frame_with_text">إطار مع نص</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Frame Text - Only show if frame_with_text is selected */}
            {frameType === 'frame_with_text' && (
                <div className="flex flex-col gap-3">
                    <FormField
                        control={control}
                        name="frame_text"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-md">نص الإطار</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2"
                                        placeholder="امسح للزيارة"
                                        maxLength={30}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={control}
                            name="frame_color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-md">لون الإطار</FormLabel>
                                    <div className="flex items-center gap-2">
                                        <FormControl>
                                            <DebouncedColorPicker
                                                {...field}
                                                className="w-12 h-10 border-2"
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2"
                                                placeholder="#000000"
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="frame_text_color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg">لون نص الإطار</FormLabel>
                                    <div className="flex items-center gap-2">
                                        <FormControl>
                                            <DebouncedColorPicker
                                                {...field}
                                                className="w-12 h-10 border-2"
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2"
                                                placeholder="#ffffff"
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            )}
        </section>
    )
}
