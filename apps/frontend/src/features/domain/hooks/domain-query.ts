import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { getDomains } from "@/features/domain/service/domain.service"
import { DomainType } from "../schemas/schema.js";

export function useGetDomains() {
    return useQuery<{ domains: DomainType[] }>({
        queryKey: ["domains"],
        queryFn: () => getDomains(),
        staleTime: 5 * 60 * 1000, // 5 minutes,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: true,
    })
}

// export function useDeleteUrl({ domain, alias }: ParamsType) {
//     const queryClient = useQueryClient();
//     const { mutateAsync, isError, isPending, isSuccess } = useMutation<FullUrlType>({
//         mutationFn: () => deleteUrl({ domain, alias }),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["urls"] })
//         }
//     })

//     return { mutateAsync, isError, isPending, isSuccess }
// }

// export function useCreateUrl() {
//     const queryClient = useQueryClient();
//     const { mutateAsync, isError, isPending, data, isSuccess, error } = useMutation({
//         mutationFn: (url: ShortUrlType) => createUrl(url),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["urls"] })
//         }
//     })

//     return { mutateAsync, isError, isPending, data, isSuccess, error }
// }

// export function useUpdateUrl() {
//     const queryClient = useQueryClient();
//     const { mutateAsync, isError, isPending, error, isSuccess } = useMutation({
//         mutationFn: (toUpdateUrl: ParamsType & ToUpdateUrlType) => updateUrl(toUpdateUrl),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["urls"] })
//         }
//     })

//     return { mutateAsync, isError, isPending, error, isSuccess }
// }
