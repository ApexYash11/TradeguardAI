"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TrendData {
  date: string
  avg_risk: number
}

export function RiskTrendsChart() {
  const [trends, setTrends] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    fetch(`${apiUrl}/api/analytics/trends?days=30`)
      .then((res) => res.json())
      .then((data) => {
        setTrends(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching trends:", err)
        setLoading(false)
      })
  }, [])

  if (loading || trends.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Loading trends...</div>
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="mb-4">
        <h3 className="font-semibold text-foreground">Historical Risk Trends</h3>
        <p className="text-xs text-muted-foreground mt-1">30-day average risk evolution</p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={trends}>
          <defs>
            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          />
          <Area type="monotone" dataKey="avg_risk" stroke="var(--chart-1)" fillOpacity={1} fill="url(#colorRisk)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
