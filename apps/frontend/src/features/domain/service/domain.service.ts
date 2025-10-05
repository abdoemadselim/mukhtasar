
import { AddDomainType } from "@mukhtasar/shared";
import { apiClient } from "@/shared/lib/api-client";

export async function getDomains() {
    return apiClient.get('/domain', {
        throwOnError: true,
        includeCredentials: true
    });
}

export async function getActiveDomains() {
    return apiClient.get('/domain/active', {
        throwOnError: true,
        includeCredentials: true
    });
}

export async function addDomain(data: AddDomainType) {
    return apiClient.post('/domain', data, {
        throwOnError: true,
        includeCredentials: true
    });
}

export async function deleteDomain(domainId: number) {
    return apiClient.delete(`/domain/${domainId}`, {
        throwOnError: true,
        includeCredentials: true
    });
}

export async function refreshDomain(domainId: number) {
    return apiClient.post(`/domain/${domainId}/refresh`, null, {
        throwOnError: true,
        includeCredentials: true
    });
}