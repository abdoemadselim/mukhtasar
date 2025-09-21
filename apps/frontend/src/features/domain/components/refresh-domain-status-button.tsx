import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openToaster } from "@/components/ui/sonner";
import { useRefreshDomain } from "@/features/domain/hooks/domain-query";

export default function RefreshDomainStatusButton({ domainId }: { domainId: number }) {
    const { mutateAsync: refreshDomain, isPending } = useRefreshDomain();

    const handleRefresh = async () => {
        try {
            await refreshDomain(domainId);
        } catch (error: any) {
            openToaster(error?.message || "فشل في تحديث النطاق", "error");
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isPending}
            className="cursor-pointer"
        >
            تحديث
            <RotateCcw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
        </Button>
    );
}