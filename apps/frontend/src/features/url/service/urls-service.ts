
import { apiClient } from "@/lib/api-client";
import { ShortUrlType } from "@mukhtasar/shared";


export async function createUrl(data: ShortUrlType) {
    return apiClient.post('/url', data, { includeCredentials: true });
}

export async function getUrls({ page = 1, page_size = 10 }: { page: number, page_size: number }) {
    const realPage = page > 0 ? page : 1;
    const endpoint = `/url?page=${realPage - 1}&pageSize=${page_size}`;

    return apiClient.get(endpoint, {
        cache: 'no-store',
        throwOnError: true // This will throw errors instead of returning error objects
    });
}
