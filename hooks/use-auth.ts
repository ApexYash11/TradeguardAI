"use client"

import { useEffect, useState } from "react"

interface User {
  id: number
  username: string
  email: string
  is_admin: boolean
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")

    if (!token) {
      setLoading(false)
      return
    }

    // Verify token with backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    fetch(`${apiUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) return res.json()
        throw new Error("Invalid token")
      })
      .then((data) => {
        setUser(data)
        setIsAuthenticated(true)
      })
      .catch(() => {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user_id")
      })
      .finally(() => setLoading(false))
  }, [])

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_id")
    setUser(null)
    setIsAuthenticated(false)
  }

  return { user, loading, isAuthenticated, logout }
}
