import { Palette } from "lucide-react"
import { useCallback, useRef } from "react"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"

import ColorPresetPicker from "@/features/qr/components/forms/color-preset-picker"

// Color validation utility
function isValidHexColor(color: string): boolean {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    return hexColorRegex.test(color)
}

interface ColorSectionProps {
    control: any
    stepNumber: number
}

// Debounced color picker component for color input
function DebouncedColorPicker({ value, onChange, ...props }: any) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const debouncedOnChange = useCallback((newValue: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            onChange(newValue)
        }, 150) // Shorter delay for color picker (150ms)
    }, [onChange])

    return (
        <Input
            {...props}
            type="color"
            value={value}
            onChange={(e) => debouncedOnChange(e.target.value)}
        />
    )
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
                                <DebouncedColorPicker
                                    {...field}
                                    className="w-12 h-10 p-0 cursor-pointer border-1 rounded-none"
                                />
                            </FormControl>
                            <FormControl>
                                <Input
                                    dir="ltr"
                                    {...field}
                                    onChange={(e) => {
                                        if (isValidHexColor(e.target.value)) {
                                            field.onChange(e.target.value)
                                        }
                                    }}
                                    className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2"
                                    maxLength={7}
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
                                <DebouncedColorPicker
                                    {...field}
                                    className="w-12 h-10 border-1 cursor-pointer rounded-none p-0"
                                />
                            </FormControl>
                            <FormControl>
                                <Input
                                    {...field}
                                    dir="ltr"
                                    onChange={(e) => {
                                        if (isValidHexColor(e.target.value)) {
                                            field.onChange(e.target.value)
                                        }
                                    }}
                                    maxLength={7}
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
