"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { TrendingDown, TrendingUp } from "lucide-react"

interface GTRI {
  gtri: number
  trend: string
  critical_count: number
  affected_ports: number
  timestamp: string
}

export function GTRICard() {
  const [gtri, setGtri] = useState<GTRI | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    fetch(`${apiUrl}/api/analytics/gtri`)
      .then((res) => res.json())
      .then((data) => {
        setGtri(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching GTRI:", err)
        setLoading(false)
      })
  }, [])

  if (loading || !gtri) {
    return <div className="text-center py-8 text-muted-foreground">Loading GTRI...</div>
  }

  const getTrendColor = () => {
    return gtri.trend === "rising" ? "text-red-600" : gtri.trend === "falling" ? "text-green-600" : "text-yellow-600"
  }

  const getTrendIcon = () => {
    return gtri.trend === "rising" ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">GTRI Score</p>
          <p className="text-3xl font-bold text-foreground">{(gtri.gtri * 100).toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground">Global Trade Risk Index</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Trend</p>
          <div className={`flex items-center gap-2 ${getTrendColor()}`}>
            {getTrendIcon()}
            <p className="text-lg font-bold capitalize">{gtri.trend}</p>
          </div>
          <p className="text-xs text-muted-foreground">7-day direction</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Critical Events</p>
          <p className="text-3xl font-bold text-red-600">{gtri.critical_count}</p>
          <p className="text-xs text-muted-foreground">Severity {">"} 70%</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Affected Ports</p>
          <p className="text-3xl font-bold text-orange-600">{gtri.affected_ports}</p>
          <p className="text-xs text-muted-foreground">Active disruptions</p>
        </div>
      </div>
    </Card>
  )
}
