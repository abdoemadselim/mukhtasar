export type Status = "pending" | "ssl_provisioning" | "active" | "failed";

export type DomainType = {
    id: number,
    created_at: string,
    status: string,
    domain: string,
    domain_type: "domain" | "subdomain"

}