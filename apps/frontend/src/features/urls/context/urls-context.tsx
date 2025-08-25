// features/url/context/url-context.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface UrlContextType {
    urlCount: number
    incrementUrlCount: () => void
    canCreateUrl: boolean
    resetUrlCount: () => void
}

const UrlContext = createContext<UrlContextType | undefined>(undefined)

const MAX_URLS_FOR_GUEST = 5

export function UrlProvider({ children }: { children: ReactNode }) {
    const [urlCount, setUrlCount] = useState(0)

    useEffect(() => {
        // Load URL count from localStorage on mount
        const savedCount = localStorage.getItem('guestUrlCount')
        if (savedCount) {
            setUrlCount(parseInt(savedCount, 10))
        }
    }, [])

    const incrementUrlCount = () => {
        const newCount = urlCount + 1
        setUrlCount(newCount)
        localStorage.setItem('guestUrlCount', newCount.toString())
    }

    const resetUrlCount = () => {
        setUrlCount(0)
        localStorage.removeItem('guestUrlCount')
    }

    const canCreateUrl = urlCount < MAX_URLS_FOR_GUEST

    return (
        <UrlContext.Provider value={{
            urlCount,
            incrementUrlCount,
            canCreateUrl,
            resetUrlCount
        }}>
            {children}
        </UrlContext.Provider>
    )
}

export function useUrl() {
    const context = useContext(UrlContext)
    if (context === undefined) {
        throw new Error('useUrl must be used within a UrlProvider')
    }
    return context
}