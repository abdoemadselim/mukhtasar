// apps/frontend/src/features/qr/service/qr-service.ts
import { apiClient } from "@/shared/lib/api-client"
import { CreateQrCodeType } from "@/features/qr/types"

export async function createQrCode(data: CreateQrCodeType) {
    console.log("data")
    console.log(data)
    const formData = new FormData()

    // Add all form fields to FormData
    formData.append('destination_url', data.destination_url)
    formData.append('foreground_color', data.foreground_color)
    formData.append('background_color', data.background_color)

    if (data.alias) formData.append('alias', data.alias)
    if (data.domain) formData.append('domain', data.domain)
    if (data.frame_type) formData.append('frame_type', data.frame_type)
    if (data.frame_text) formData.append('frame_text', data.frame_text)
    if (data.frame_color) formData.append('frame_color', data.frame_color)
    if (data.frame_text_color) formData.append('frame_text_color', data.frame_text_color)

    // Add logo file if present
    if (data.logo) {
        formData.append('logo', data.logo)
    }

    return apiClient.post('/qr', formData, {
        throwOnError: true,
        includeCredentials: true,
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