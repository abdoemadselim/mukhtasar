import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createUrl, deleteUrl, getUrls, updateUrl } from "@/features/url/service/urls-service"
import { FullUrlType, ParamsType, ShortUrlType, ToUpdateUrlType } from "@mukhtasar/shared";

export function useGetUrls({ page, page_size }: { page: number, page_size: number }) {
    return useQuery<{ urls: FullUrlType[], total: number }>({
        queryKey: ["urls", page, page_size],
        queryFn: () => getUrls({ page, page_size }),
        staleTime: 5 * 60 * 1000, // 5 minutes,
        gcTime: 10 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
    })
}

export function useDeleteUrl({ domain, alias }: ParamsType) {
    const queryClient = useQueryClient();
    const { mutateAsync, isError, isPending, isSuccess } = useMutation<FullUrlType>({
        mutationFn: () => deleteUrl({ domain, alias }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["urls"] })
        }
    })

    return { mutateAsync, isError, isPending, isSuccess }
}

export function useCreateUrl() {
    const queryClient = useQueryClient();
    const { mutateAsync, isError, isPending, data, isSuccess } = useMutation({
        mutationFn: (url: ShortUrlType) => createUrl(url),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["urls"] })
        }
    })

    return { mutateAsync, isError, isPending, data, isSuccess }
}

export function useUpdateUrl() {
    const queryClient = useQueryClient();
    const { mutateAsync, isError, isPending, error, isSuccess } = useMutation({
        mutationFn: (toUpdateUrl:  ParamsType & ToUpdateUrlType) => updateUrl(toUpdateUrl),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["urls"] })
        }
    })

    return { mutateAsync, isError, isPending, error, isSuccess }
}
