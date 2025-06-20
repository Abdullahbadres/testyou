"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiService } from "@/api"

interface User {
  id: string
  email: string
  username: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (emailOrUsername: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token")
        if (token) {
          setIsAuthenticated(true)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (emailOrUsername: string, password: string) => {
    try {
      // Determine if input is email or username
      const isEmail = emailOrUsername.includes("@")
      const loginData = isEmail ? { email: emailOrUsername, password } : { username: emailOrUsername, password }

      console.log("Attempting login with:", { isEmail, emailOrUsername })

      const response = await apiService.login(loginData)
      setIsAuthenticated(true)

      if (response.user) {
        setUser(response.user)
      }

      console.log("Login successful")
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const register = async (email: string, username: string, password: string) => {
    try {
      console.log("Attempting registration with:", { email, username })

      const response = await apiService.register({ email, username, password })
      setIsAuthenticated(true)

      if (response.user) {
        setUser(response.user)
      }

      console.log("Registration successful")
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    }
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
    }
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
