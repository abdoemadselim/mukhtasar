import { useQuery } from "@tanstack/react-query"
import { TokenType } from "@mukhtasar/shared"

import { getTokens } from "@/features/token/service/tokens-service"

export function useGetTokens({ page, page_size }: { page: number, page_size: number }) {
    return useQuery<{ tokens: TokenType[], total: number }>({
        queryKey: ["tokens", page, page_size],
        queryFn: () => getTokens({ page, page_size }),
        staleTime: 5 * 60 * 1000, // 5 minutes,
        gcTime: 10 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
    })
}