'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { logout as logoutService } from '@/features/auth/service/auth'
import { useRouter } from "next/navigation";

type User = {
    id: string
    name: string,
    verified: boolean,
    email: string
}

type AuthContextType = {
    user: User | null,
    checkAuth: () => Promise<void>,
    logout: () => Promise<void>,
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            setIsLoading(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { cache: "no-store" })

            if (res.ok) {
                const { data: { user } } = await res.json();
                return setUser(user)
            }

            setUser(null);
        } catch (error) {
            console.error('Auth check failed:', error)
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async (): Promise<void> => {
        try {
            setIsLoading(true)
            const result = await logoutService()

            if (result.success) {
                setUser(null)
            }

        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const value = {
        user,
        checkAuth,
        logout,
        isLoading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )

}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context;
}

export function ProtectedAuthRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const [isRedirecting, setIsRedirecting] = useState(true)
    const router = useRouter();

    useEffect(() => {
        setIsRedirecting(true)
        if (!user) {
            router.replace("/login")
            setIsRedirecting(false)
        }
    }, [user, router])

    // Show loading spinner while checking authentication
    if (isLoading || !isRedirecting) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return children;
}