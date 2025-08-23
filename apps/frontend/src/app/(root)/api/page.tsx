"use client"

import "swagger-ui-react/swagger-ui.css"

import SwaggerUI from "swagger-ui-react";

export default function ApiDocsPage() {
    return (
        <div style={{ height: "100vh" }} dir="ltr">
            <SwaggerUI url="/api-docs.json" />
        </div>
    )
}
