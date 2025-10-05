import ColorSection from "@/features/qr/components/sections/color-section";
import UrlAndLogoSection from "@/features/qr/components/sections/url-and-logo-section";
import ShortLinkSection from "@/features/qr/components/sections/short-link-section";
import FrameSection from "@/features/qr/components/sections/frame-section";
import { useGetActiveDomains } from "@/features/domain/hooks/domain-query";
import { memo, useMemo } from "react";

interface QrCodeDialogControllersProps {
    form: any,
    currentStep: number,
}

export function QrCodeDialogControllers({
    form,
    currentStep,
}: QrCodeDialogControllersProps) {
    const { data: activeDomains } = useGetActiveDomains()

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
            {/* Form controls */}
            {currentStep === 0 && (
                <>
                    <UrlAndLogoSection
                        control={form.control}
                        stepNumber={currentStep + 1}
                        resetFieldValue={() => form.resetField("logo")}
                    />
                    <ColorSection
                        control={form.control}
                        stepNumber={currentStep + 2}
                    />
                </>
            )}

            {currentStep === 1 && (
                <>
                    <ShortLinkSection
                        control={form.control}
                        activeDomains={activeDomains}
                        stepNumber={currentStep + 2}
                    />
                    <FrameSection
                        control={form.control}
                        watch={form.watch}
                        stepNumber={currentStep + 3}
                    />
                </>
            )}
        </div>
    )
}

export default memo(QrCodeDialogControllers)