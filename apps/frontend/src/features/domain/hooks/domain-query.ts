import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AddDomainType } from "@mukhtasar/shared";

import { addDomain, deleteDomain, getActiveDomains, getDomains, refreshDomain } from "@/features/domain/service/domain.service"
import { DomainType } from "@/features/domain/types.js";

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

// Used for create url dialog (to show users the custom domains he owns and can choose from)
export function useGetActiveDomains() {
    const { data, isError, isPending, isSuccess, error } = useQuery({
        queryKey: ["active-domains"],
        queryFn: () => getActiveDomains(),
        staleTime: 5 * 60 * 1000, // 5 minutes,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
    })

    return { data, isError, error, isPending, isSuccess };
}

export function useDeleteDomain(id: number) {
    const queryClient = useQueryClient();
    const { mutateAsync, isError, isPending, isSuccess, error } = useMutation<DomainType>({
        mutationFn: () => deleteDomain(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["domains"] })
        }
    })

    return { mutateAsync, isError, isPending, isSuccess, error }
}

export function useAddDomain() {
    const queryClient = useQueryClient();
    const { mutateAsync, isError, isPending, data, isSuccess, error } = useMutation({
        mutationFn: (domain: AddDomainType) => addDomain(domain),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["domains"] })
        }
    })

    return { mutateAsync, isError, isPending, data, isSuccess, error }
}

export function useRefreshDomain() {
    const queryClient = useQueryClient();
    const { mutateAsync, isError, isPending, error } = useMutation({
        mutationFn: (domainId: number) => refreshDomain(domainId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["domains"] })
        }
    })

    return { mutateAsync, isError, isPending, error }
}