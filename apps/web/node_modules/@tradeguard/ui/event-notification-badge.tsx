"use client"

import { useEffect, useState } from "react"
import { Bell, X } from "lucide-react"
import { useWebSocket } from "@/hooks/use-websocket"

export function EventNotificationBadge() {
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; severity: number }>>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const { lastEvent } = useWebSocket()

  useEffect(() => {
    if (lastEvent && lastEvent.severity > 0.7) {
      const newNotification = {
        id: Date.now().toString(),
        title: lastEvent.title,
        severity: lastEvent.severity,
      }
      setNotifications((prev) => [newNotification, ...prev].slice(0, 5))
    }
  }, [lastEvent])

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 hover:bg-muted rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {showDropdown && notifications.length > 0 && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg p-4 space-y-2 z-50">
          {notifications.map((notif) => (
            <div key={notif.id} className="flex items-start justify-between p-2 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground line-clamp-2">{notif.title}</p>
                <p className="text-xs text-muted-foreground mt-1">Severity: {(notif.severity * 100).toFixed(0)}%</p>
              </div>
              <button
                onClick={() => dismissNotification(notif.id)}
                className="ml-2 p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
