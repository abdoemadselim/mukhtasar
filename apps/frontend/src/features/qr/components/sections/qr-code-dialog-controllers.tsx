import { memo } from "react"
import { useFormContext } from "react-hook-form";

import ColorSection from "@/features/qr/components/sections/color-section";
import UrlAndLogoSection from "@/features/qr/components/sections/url-and-logo-section";
import ShortLinkSection from "@/features/qr/components/sections/short-link-section";
import FrameSection from "@/features/qr/components/sections/frame-section";
import { useGetActiveDomains } from "@/features/domain/hooks/domain-query";

interface QrCodeDialogControllersProps {
    currentStep: number,
}

const QrCodeDialogControllers = memo(function QrCodeDialogControllers({
    currentStep,
}: QrCodeDialogControllersProps) {
    const { data: activeDomains } = useGetActiveDomains()

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
            {/* Show step 0 sections if current step is 0 OR if there are errors in step 0 */}
            {(currentStep === 0) && (
                <>
                    <UrlAndLogoSection
                        stepNumber={currentStep + 1}
                    />
                    <ColorSection
                        stepNumber={currentStep + 2}
                    />
                </>
            )}

            {/* Show step 1 sections if current step is 1 OR if there are errors in step 1 */}
            {(currentStep === 1) && (
                <>
                    <ShortLinkSection
                        activeDomains={activeDomains}
                        stepNumber={currentStep + 2}
                    />
                    <FrameSection
                        stepNumber={currentStep + 3}
                    />
                </>
            )}
        </div>
    )
})

export default QrCodeDialogControllers