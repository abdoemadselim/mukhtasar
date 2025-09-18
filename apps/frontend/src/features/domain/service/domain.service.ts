
import { apiClient } from "@/lib/api-client";

// export async function createUrl(data: ShortUrlType) {
//     return apiClient.post('/url', data, { throwOnError: true, includeCredentials: true });
// }

export async function getDomains() {
    const endpoint = `/domain`;

    return apiClient.get(endpoint, {
        throwOnError: true, // This will throw errors instead of returning error objects
        includeCredentials: true
    });
}

// export async function deleteUrl({ domain, alias }: ParamsType) {
//     return apiClient.delete(`/url/${domain}/${alias}`, {
//         throwOnError: true, // This will throw errors instead of returning error objects
//         includeCredentials: true
//     });
// }

// export async function updateUrl({ domain, alias, original_url }: ParamsType & ToUpdateUrlType) {
//     return apiClient.patch(`/url/${domain}/${alias}`, { original_url }, {
//         throwOnError: true,
//         includeCredentials: true
//     });
// }