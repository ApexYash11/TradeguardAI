"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PortAnalytics {
  name: string
  country: string
  risk_score: number
  active_events: number
}

interface TrendData {
  date: string
  avg_risk: number
}

export function AdvancedAnalytics() {
  const [portAnalytics, setPortAnalytics] = useState<PortAnalytics[]>([])
  const [trends, setTrends] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    Promise.all([fetch(`${apiUrl}/api/analytics/ports`), fetch(`${apiUrl}/api/analytics/trends?days=30`)])
      .then(async ([portsRes, trendsRes]) => {
        const portsData = await portsRes.json()
        const trendsData = await trendsRes.json()

        setPortAnalytics(portsData)
        setTrends(trendsData)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching analytics:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading analytics...</div>
  }

  const getRiskColor = (risk: number) => {
    if (risk > 0.7) return "text-red-600"
    if (risk > 0.3) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Advanced Analytics</h2>
        <p className="text-sm text-muted-foreground mt-1">Comprehensive port and risk trend analytics</p>
      </div>

      {/* Historical Trends */}
      <Card className="p-6 bg-card border-border">
        <h3 className="font-semibold text-foreground mb-4">Risk Trends (30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trends}>
            <defs>
              <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" domain={[0, 1]} />
            <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
            <Area type="monotone" dataKey="avg_risk" stroke="var(--chart-1)" fill="url(#colorTrend)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Port Risk Ranking */}
      <Card className="p-6 bg-card border-border">
        <h3 className="font-semibold text-foreground mb-4">Port Risk Ranking</h3>
        <div className="space-y-2">
          {portAnalytics.map((port, index) => (
            <div key={port.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-muted-foreground w-6">{index + 1}</span>
                <div>
                  <p className="font-medium text-foreground">{port.name}</p>
                  <p className="text-xs text-muted-foreground">{port.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`text-lg font-bold ${getRiskColor(port.risk_score)}`}>
                    {(port.risk_score * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-muted-foreground">{port.active_events} events</p>
                </div>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      port.risk_score > 0.7 ? "bg-red-500" : port.risk_score > 0.3 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${port.risk_score * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Risk Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-card border-border">
          <p className="text-xs text-muted-foreground">Highest Risk Port</p>
          <p className="text-lg font-bold text-foreground mt-2">
            {portAnalytics.length > 0
              ? `${portAnalytics[0].name} (${(portAnalytics[0].risk_score * 100).toFixed(0)}%)`
              : "N/A"}
          </p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <p className="text-xs text-muted-foreground">Average Risk</p>
          <p className="text-lg font-bold text-foreground mt-2">
            {portAnalytics.length > 0
              ? `${((portAnalytics.reduce((sum, p) => sum + p.risk_score, 0) / portAnalytics.length) * 100).toFixed(
                  1,
                )}%`
              : "N/A"}
          </p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <p className="text-xs text-muted-foreground">Total Active Events</p>
          <p className="text-lg font-bold text-foreground mt-2">
            {portAnalytics.reduce((sum, p) => sum + p.active_events, 0)}
          </p>
        </Card>
      </div>
    </div>
  )
}
