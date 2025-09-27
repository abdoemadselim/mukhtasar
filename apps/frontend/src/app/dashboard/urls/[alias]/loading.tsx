import React from "react";
import Loader from "@/components/ui/loader";

export default function DashboardLoader() {
    return (
        <div className="flex min-h-screen justify-center items-center">
            <Loader />
        </div>
    )
}
