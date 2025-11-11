"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface Event {
  id: number
  title: string
  summary: string
  severity: number
  port: string
  commodity: string
  timestamp: string
  source: string
}

function getSeverityBadgeClass(severity: number): string {
  if (severity < 0.3) return "bg-green-100 text-green-800"
  if (severity < 0.7) return "bg-yellow-100 text-yellow-800"
  return "bg-red-100 text-red-800"
}

function getSeverityLabel(severity: number): string {
  if (severity < 0.3) return "Stable"
  if (severity < 0.7) return "Caution"
  return "Critical"
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

export function EventFeed() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    fetch(`${apiUrl}/api/events?limit=10`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching events:", err)
        setError("Failed to fetch events. Using mock data.")
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading events...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Recent Trade Events</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time monitoring of global trade disruptions and supply chain events
        </p>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-800">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {events.map((event) => (
          <Link href={`/events/${event.id}`} key={event.id}>
            <Card className="p-5 bg-card border-border hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground text-base">{event.title}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityBadgeClass(event.severity)}`}
                    >
                      {getSeverityLabel(event.severity)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{event.summary}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <span className="font-medium">Source: {event.source}</span>
                    <span>•</span>
                    <span>{formatTimestamp(event.timestamp)}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {event.port && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">{event.port}</span>
                )}
                {event.commodity && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">{event.commodity}</span>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
