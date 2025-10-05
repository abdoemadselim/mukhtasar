// apps/frontend/src/features/qr/service/qr-service.ts
import { apiClient } from "@/shared/lib/api-client"
import { CreateQrCodeType } from "@/features/qr/types"

export async function createQrCode(data: CreateQrCodeType) {
    return apiClient.post('/qr', data, {
        throwOnError: true,
        includeCredentials: true
    })
}

export async function getQrCodes({ page = 1, page_size = 10 }: { page: number, page_size: number }) {
    const realPage = page > 0 ? page : 1
    const endpoint = `/qr?page=${realPage - 1}&pageSize=${page_size}`
    return apiClient.get(endpoint, {
        throwOnError: true,
        includeCredentials: true
    })
}

export async function deleteQrCode(id: string) {
    return apiClient.delete(`/qr/${id}`, {
        throwOnError: true,
        includeCredentials: true
    })
}

export async function updateQrCode(id: string, data: CreateQrCodeType) {
    return apiClient.patch(`/qr/${id}`, data, {
        throwOnError: true,
        includeCredentials: true
    })
}

export async function downloadQrCode(id: string, format: 'png' | 'svg' = 'png') {
    return apiClient.get(`/qr/${id}/download?format=${format}`, {
        throwOnError: true,
        includeCredentials: true,
        responseType: 'blob'
    })
}