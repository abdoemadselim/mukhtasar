import { RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { openToaster } from "@/components/ui/sonner";

import { useRefreshDomain } from "@/features/domain/hooks/domain-query";

export default function RefreshDomainStatusButton({ domainId }: { domainId: number }) {
    const { mutateAsync: refreshDomain, isPending } = useRefreshDomain();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const handleRefresh = async () => {
        try {
            await refreshDomain(domainId);
        } catch (error: any) {
            openToaster(error?.message || "فشل في تحديث النطاق", "error");
        }
    };

    // Auto refresh every 2 minutes
    useEffect(() => {
        intervalRef.current = setInterval(async () => {
            await refreshDomain(domainId);
        }, 2 * 60 * 1000); // 2 minutes

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [domainId, refreshDomain]);

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