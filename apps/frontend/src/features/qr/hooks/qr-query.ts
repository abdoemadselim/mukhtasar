// apps/frontend/src/features/qr/hooks/qr-query.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QrCodeType, QrCodeResponse, CreateQrCodeType, UpdateQrCodeType } from "@/features/qr/types"
import { createQrCode, deleteQrCode, getQrCodes, updateQrCode, downloadQrCode } from "@/features/qr/service/query-service"

export function useGetQrCodes({ page, page_size }: { page: number, page_size: number }) {
    const { data, isError, isPending, isSuccess, error } = useQuery<QrCodeResponse>({
        queryKey: ["qr-codes", page, page_size],
        queryFn: () => getQrCodes({ page, page_size }),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: true,
    })

    return { data, isError, isPending, isSuccess, error }
}

export function useCreateQrCode() {
    const queryClient = useQueryClient()
    const { mutateAsync, isError, isPending, data, isSuccess, error } = useMutation({
        mutationFn: (qrCode: CreateQrCodeType) => createQrCode(qrCode),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["qr-codes"] })
        }
    })

    return { mutateAsync, isError, isPending, data, isSuccess, error }
}

export function useDeleteQrCode(id: string) {
    const queryClient = useQueryClient()
    const { mutateAsync, isError, isPending, isSuccess } = useMutation<QrCodeType>({
        mutationFn: () => deleteQrCode(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["qr-codes"] })
        }
    })

    return { mutateAsync, isError, isPending, isSuccess }
}

export function useUpdateQrCode() {
    const queryClient = useQueryClient()
    const { mutateAsync, isError, isPending, error, isSuccess } = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateQrCodeType }) => updateQrCode(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["qr-codes"] })
        }
    })

    return { mutateAsync, isError, isPending, error, isSuccess }
}

export function useDownloadQrCode() {
    const { mutateAsync, isError, isPending, error } = useMutation({
        mutationFn: ({ id, format }: { id: string; format?: 'png' | 'svg' }) =>
            downloadQrCode(id, format),
    })

    return { mutateAsync, isError, isPending, error }
}