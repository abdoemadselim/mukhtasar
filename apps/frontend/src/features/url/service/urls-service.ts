
import { ParamsType, ShortUrlType, ToUpdateUrlType } from "@mukhtasar/shared";

import { apiClient } from "@/shared/lib/api-client";

export async function createUrl(data: ShortUrlType) {
    return apiClient.post('/url', data, { throwOnError: true, includeCredentials: true });
}

export async function getUrls({ page = 1, page_size = 10 }: { page: number, page_size: number }) {
    const realPage = page > 0 ? page : 1;
    const endpoint = `/url?page=${realPage - 1}&pageSize=${page_size}`;

    return apiClient.get(endpoint, {
        throwOnError: true, // This will throw errors instead of returning error objects
        includeCredentials: true
    });
}

export async function deleteUrl({ domain, alias }: ParamsType) {
    return apiClient.delete(`/url/${domain}/${alias}`, {
        throwOnError: true, // This will throw errors instead of returning error objects
        includeCredentials: true
    });
}

export async function updateUrl({ domain, alias, original_url }: ParamsType & ToUpdateUrlType) {
    return apiClient.patch(`/url/${domain}/${alias}`, { original_url }, {
        throwOnError: true,
        includeCredentials: true
    });
}

export async function getActiveDomains() {
    return apiClient.get("/domain/")
}