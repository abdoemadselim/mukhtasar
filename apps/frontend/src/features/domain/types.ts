export type Status = "pending" | "active" | "failed" | "ssl_pending";

export type DomainType = {
    id: number,
    created_at: string,
    status: string,
    domain: string,
}