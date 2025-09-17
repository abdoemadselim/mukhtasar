import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UrlPageLoading() {
    return (
        <>
            {/* Header section with title and create button */}
            <div className="flex justify-between items-center px-6 pt-2 pb-3">
                <h1 className="text-2xl md:text-3xl">رموز وصولك (APIs tokens)</h1>
                <Button size="sm" disabled className="cursor-not-allowed opacity-50">
                    <Plus />
                    <span className="hidden lg:inline text-md">أنشىء رمز وصول</span>
                </Button>
            </div>

            {/* Data table loading skeleton */}
            <div className="px-6 space-y-4">
                {/* Table header */}
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                </div>

                {/* Table content */}
                <div className="rounded-md border">
                    {/* Table header row */}
                    <div className="flex items-center justify-between p-4 border-b bg-muted/50">
                        <div className="flex items-center space-x-4 flex-1">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                    </div>

                    {/* Table rows */}
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border-b last:border-b-0">
                            <div className="flex items-center space-x-4 flex-1">
                                <Skeleton className="h-4 w-8" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Skeleton className="h-8 w-8 rounded" />
                                <Skeleton className="h-8 w-8 rounded" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                </div>
            </div>
        </>
    );
}