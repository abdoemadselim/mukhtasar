import { useCallback, useRef } from "react"
import { Input } from "@/shared/components/ui/input"

// Debounced color picker component for color input
export default function DebouncedColorPicker({ value, onChange, ...props }: any) {
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