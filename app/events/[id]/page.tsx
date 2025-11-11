"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Event {
  id: number
  title: string
  summary: string
  severity: number
  port: string
  commodity: string
  timestamp: string
}

function getSeverityColor(severity: number): string {
  if (severity < 0.3) return "bg-green-500/20 text-green-600 border-green-500"
  if (severity < 0.7) return "bg-yellow-500/20 text-yellow-600 border-yellow-500"
  return "bg-red-500/20 text-red-600 border-red-500"
}

function getSeverityLabel(severity: number): string {
  if (severity < 0.3) return "Stable"
  if (severity < 0.7) return "Caution"
  return "Critical"
}

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.id
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!eventId) return

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    fetch(`${apiUrl}/api/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching event:", err)
        setLoading(false)
      })
  }, [eventId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-6 py-4">
          <Link href="/">
            <Button variant="ghost">← Back to Dashboard</Button>
          </Link>
        </div>
        <div className="px-6 py-4">Loading event...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-6 py-4">
          <Link href="/">
            <Button variant="ghost">← Back to Dashboard</Button>
          </Link>
          <Card className="p-6 mt-6">
            <p className="text-muted-foreground">Event not found</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-4 border-b border-border">
        <Link href="/">
          <Button variant="ghost">← Back to Dashboard</Button>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <Card className="p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-foreground">{event.title}</h1>
            <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getSeverityColor(event.severity)}`}>
              {getSeverityLabel(event.severity)} - {(event.severity * 100).toFixed(0)}%
            </span>
          </div>

          <p className="text-foreground text-lg mb-8 leading-relaxed">{event.summary}</p>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Port</p>
              <p className="text-lg font-semibold text-foreground mt-1">{event.port}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Commodity</p>
              <p className="text-lg font-semibold text-foreground mt-1">{event.commodity}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Timestamp</p>
              <p className="text-lg font-semibold text-foreground mt-1">{new Date(event.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
