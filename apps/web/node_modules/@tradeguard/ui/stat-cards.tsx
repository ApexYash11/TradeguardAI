"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp, AlertTriangle, Activity, LineChart } from "lucide-react"
import { GTRICard } from "./gtri-card"

interface Stats {
  activeEvents: number
  criticalAlerts: number
  avgRiskScore: number
  trend: string
}

export function StatCards() {
  const [stats, setStats] = useState<Stats>({
    activeEvents: 0,
    criticalAlerts: 0,
    avgRiskScore: 0,
    trend: "Stable",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    Promise.all([fetch(`${apiUrl}/api/events`), fetch(`${apiUrl}/api/skus`)])
      .then(async ([eventsRes, skusRes]) => {
        const events = await eventsRes.json()
        const skus = await skusRes.json()

        const criticalCount = events.filter((e: any) => e.severity > 0.7).length
        const avgRisk =
          skus.length > 0
            ? ((skus.reduce((sum: number, sku: any) => sum + sku.risk_score, 0) / skus.length) * 100).toFixed(1)
            : 0

        setStats({
          activeEvents: events.length,
          criticalAlerts: criticalCount,
          avgRiskScore: Number.parseFloat(avgRisk as string),
          trend: "Increasing",
        })
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching stats:", err)
        setLoading(false)
      })
  }, [])

  const statItems = [
    {
      label: "Active Events",
      value: stats.activeEvents,
      change: "+2 from last hour",
      icon: Activity,
      className: "text-blue-600",
    },
    {
      label: "Critical Alerts",
      value: stats.criticalAlerts,
      change: "Requires immediate attention",
      icon: AlertTriangle,
      className: "text-red-600",
    },
    {
      label: "Avg Risk Score",
      value: `${stats.avgRiskScore}%`,
      change: "Current SKU risk level",
      icon: LineChart,
      className: "text-orange-600",
    },
    {
      label: "Trend",
      value: stats.trend,
      change: "7-day forecast direction",
      icon: TrendingUp,
      className: "text-red-600",
    },
  ]

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon
          return (
            <Card key={index} className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium">{item.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-2">{item.change}</p>
                </div>
                <Icon className={`w-5 h-5 ${item.className}`} />
              </div>
            </Card>
          )
        })}
      </div>
      <div className="mt-4">
        <GTRICard />
      </div>
    </>
  )
}
