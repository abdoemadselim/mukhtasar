
import { apiClient } from "@/lib/api-client";
import { AddDomainType } from "@mukhtasar/shared";

export async function getDomains() {
    const endpoint = `/domain`;

    return apiClient.get(endpoint, {
        throwOnError: true, // This will throw errors instead of returning error objects
        includeCredentials: true
    });
}

export async function addDomain(data: AddDomainType) {
    return apiClient.post('/domain', data, {
        throwOnError: true,
        includeCredentials: true
    });
}

export async function deleteDomain(id: number) {
    return apiClient.delete("/domain", {
        body: JSON.stringify({
            id
        }),
        throwOnError: true, // This will throw errors instead of returning error objects
        includeCredentials: true
    });
}

export async function refreshDomain(domainId?: number) {
    return apiClient.post(`/domain/${domainId}/refresh`, {
        throwOnError: true,
        includeCredentials: true
    });
}