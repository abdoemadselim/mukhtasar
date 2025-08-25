'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { logout as logoutService } from '@/features/auth/service/auth'

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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                cache: "no-store",
                credentials: 'include'
            })

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