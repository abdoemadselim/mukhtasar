import clsx from "clsx";
import { Status } from "@/features/domain/types";

export const statusMap: Record<Status, string> = {
    pending: "قيد المراجعة",
    active: "مفعل",
    failed: "فشل",
    ssl_pending: "انتظار إصدار الشهادة"
}

function DomainStatusBadge({ status }: { status: Status }) {
    const containerStyle: Record<Status, string> = {
        pending: "bg-yellow-200",
        active: "bg-green-200",
        failed: "bg-red-200",
        ssl_pending: "bg-blue-200"
    }

    const circleStyle: Record<Status, string> = {
        pending: "bg-yellow-500",
        active: "bg-green-500",
        failed: "bg-red-500",
        ssl_pending: "bg-blue-500"
    }

    const childStyle: Record<Status, string> = {
        pending: "text-yellow-800",
        active: "text-green-800",
        failed: "text-red-800",
        ssl_pending: "text-blue-800"
    }

    return (
        <div className="lg:text-md">
            <div
                className={clsx(
                    "flex items-center px-2 gap-4 py-[1px] w-fit rounded-xl",
                    containerStyle[status]
                )}
            >
                <div
                    className={clsx("w-[10px] h-[10px] rounded-full", circleStyle[status])}
                ></div>

                <p className={`${childStyle[status]} text-[1rem]`}>
                    {statusMap[status]}
                </p>
            </div>
        </div>
    );
}

export default DomainStatusBadge;
