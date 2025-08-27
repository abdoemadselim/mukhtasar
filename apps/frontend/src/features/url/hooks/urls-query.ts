import { useQuery } from "@tanstack/react-query"
import { getUrls } from "@/features/url/service/urls-service"
import { UrlType } from "@/features/url/schemas/scheme"

export function useGetUrls({ page, page_size }: { page: number, page_size: number }) {
    console.log("fetching urls...")
    return useQuery<{ urls: UrlType[], total: number }>({
        queryKey: ["urls", page, page_size],
        queryFn: () => getUrls({ page, page_size }),
        staleTime: 5 * 60 * 1000, // 5 minutes,
        gcTime: 10 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
    })
}