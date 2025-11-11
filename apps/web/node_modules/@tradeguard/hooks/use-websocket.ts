"use client"

import { useEffect, useState, useRef } from "react"

interface WSEvent {
  id: number
  title: string
  summary: string
  severity: number
  port: string
  commodity: string
  timestamp: string
}

export function useWebSocket(url?: string) {
  const [lastEvent, setLastEvent] = useState<WSEvent | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Construct WebSocket URL from environment or default
    const wsUrl =
      url || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`.replace("http", "ws") + "/ws/events"

    // Don't connect in development without backend
    if (!wsUrl.includes("localhost")) return

    try {
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log("[v0] WebSocket connected")
        setIsConnected(true)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setLastEvent(data)
        } catch (e) {
          console.error("[v0] Failed to parse WebSocket message:", e)
        }
      }

      ws.onerror = (error) => {
        console.error("[v0] WebSocket error:", error)
        setIsConnected(false)
      }

      ws.onclose = () => {
        console.log("[v0] WebSocket disconnected")
        setIsConnected(false)
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          console.log("[v0] Attempting WebSocket reconnection...")
        }, 3000)
      }

      wsRef.current = ws

      return () => {
        if (wsRef.current) {
          wsRef.current.close()
        }
      }
    } catch (error) {
      console.error("[v0] Failed to create WebSocket:", error)
    }
  }, [url])

  return { lastEvent, isConnected }
}
