'use client'

import { Palette } from "lucide-react"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ColorPresetPicker from "@/features/qr/components/forms/color-preset-picker"

interface ColorSectionProps {
    control: any
    stepNumber: number
}

export default function ColorSection({ control, stepNumber }: ColorSectionProps) {
    return (
        <section className="space-y-4 bg-white p-4 rounded-lg relative">
            <span className="bg-primary text-white w-7 h-7 flex items-center justify-center font-bold text-center p-4 rounded-full text-xl absolute top-[-17px] right-[-10px] border-1">
                {stepNumber}
            </span>

            <div className="flex items-center gap-3">
                <Palette color="red" />
                <p className="text-xl">اختر الألوان المناسبة</p>
            </div>

            <FormField
                control={control}
                name="foreground_color"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-md">لون الكود</FormLabel>

                        {/* Color Presets */}
                        <ColorPresetPicker
                            selectedColor={field.value}
                            onColorSelect={field.onChange}
                        />

                        {/* Manual Color Input */}
                        <div className="flex items-center gap-2 pt-2">
                            <FormControl>
                                <Input
                                    type="color"
                                    {...field}
                                    className="w-12 h-10 p-0 cursor-pointer border-1 rounded-none"
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
                name="background_color"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-md">لون الخلفية</FormLabel>

                        {/* Manual Color Input */}
                        <div className="flex items-center gap-2 pt-2">
                            <FormControl>
                                <Input
                                    type="color"
                                    {...field}
                                    className="w-12 h-10 border-1 cursor-pointer rounded-none p-0"
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
        </section>
    )
}
