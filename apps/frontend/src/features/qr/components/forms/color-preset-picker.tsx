// apps/frontend/src/features/qr/components/color-preset-picker.tsx
'use client'

import { Check } from "lucide-react"

interface ColorPresetPickerProps {
    selectedColor: string
    onColorSelect: (color: string) => void
    label?: string
}

const PRESET_COLORS = [
    { name: 'أسود', value: '#000000' },
    { name: 'أحمر', value: '#ef4444' },
    { name: 'أزرق', value: '#3b82f6' },
    { name: 'أخضر', value: '#22c55e' },
    { name: 'برتقالي', value: '#f97316' },
    { name: 'بنفسجي', value: '#a855f7' },
    { name: 'وردي', value: '#ec4899' },
]

export default function ColorPresetPicker({
    selectedColor,
    onColorSelect,
    label
}: ColorPresetPickerProps) {
    return (
        <div className="space-y-2">
            {label && <p className="text-sm font-medium">{label}</p>}
            <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => (
                    <button
                        key={color.value}
                        type="button"
                        onClick={() => onColorSelect(color.value)}
                        className="relative w-10 h-10 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                    >
                        {selectedColor?.toLowerCase() === color.value.toLowerCase() && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Check
                                    size={20}
                                    className="drop-shadow-lg"
                                    style={{
                                        color: color.value === '#ffffff' ? '#000000' : '#ffffff'
                                    }}
                                />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}