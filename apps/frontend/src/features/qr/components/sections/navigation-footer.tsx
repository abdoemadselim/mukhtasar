'use client'

import { MoveRight, MoveLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"

interface NavigationFooterProps {
    currentStep: number
    totalSteps: number
    formState: any
    onNextStep: () => void
    onBackStep: () => void
    onDialogClose: () => void
}

export default function NavigationFooter({
    currentStep,
    totalSteps,
    formState,
    onNextStep,
    onBackStep,
    onDialogClose
}: NavigationFooterProps) {
    return (
        <div className="flex gap-2 pt-4">
            <DialogClose asChild>
                {currentStep === 0 && (
                    <Button variant="outline" className="cursor-pointer" onClick={onDialogClose}>
                        إلغاء
                    </Button>
                )}
            </DialogClose>

            <div className="w-full flex flex-col-reverse gap-2 sm:flex-row">
                {currentStep > 0 && (
                    <Button type="button" variant="outline" onClick={onBackStep} className="w-full sm:w-fit">
                        <MoveRight />
                        السابق
                    </Button>
                )}

                {currentStep < totalSteps - 1 && (
                    <Button type="button" onClick={onNextStep} className="w-full sm:w-fit">
                        التالي
                        <MoveLeft />
                    </Button>
                )}

                {currentStep === totalSteps - 1 && (
                    <Button type="submit" className="cursor-pointer w-full sm:w-fit" disabled={formState.isSubmitting}>
                        {formState.isSubmitting ? "جاري الإنشاء..." : "إنشاء كود QR"}
                    </Button>
                )}
            </div>
        </div>
    )
}
