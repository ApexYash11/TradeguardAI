"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface SKUForecast {
  id: number
  name: string
  current_risk: number
  forecast: Array<{ date: string; risk: number; upper_bound?: number; lower_bound?: number }>
}

interface ComparisonData {
  skus: SKUForecast[]
  comparison_date: string
}

export function MultiSKUForecast() {
  const [data, setData] = useState<ComparisonData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    fetch(`${apiUrl}/api/forecast/comparison?sku_ids=1,2,3,4,5`)
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching multi-SKU forecast:", err)
        setLoading(false)
      })
  }, [])

  if (loading || !data) {
    return <div className="text-center py-8 text-muted-foreground">Loading comparison...</div>
  }

  // Combine forecast data for all SKUs
  const combinedData: any[] = []
  const maxDays = Math.max(...data.skus.map((s) => s.forecast.length))

  for (let i = 0; i < maxDays; i++) {
    const point: any = {}
    data.skus.forEach((sku) => {
      if (i < sku.forecast.length) {
        point[`sku_${sku.id}`] = sku.forecast[i].risk
      }
    })
    if (Object.keys(point).length > 0) {
      combinedData.push(point)
    }
  }

  const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Multi-SKU Risk Comparison</h2>
        <p className="text-sm text-muted-foreground mt-1">Compare forecasted risk trends across multiple SKUs</p>
      </div>

      <Card className="p-6 bg-card border-border">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            />
            <Legend />
            {data.skus.map((sku, index) => (
              <Line
                key={sku.id}
                type="monotone"
                dataKey={`sku_${sku.id}`}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                name={sku.name}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {data.skus.map((sku) => (
          <Card key={sku.id} className="p-4 bg-card border-border">
            <p className="text-xs text-muted-foreground font-medium">{sku.name}</p>
            <p className="text-2xl font-bold text-foreground mt-2">{(sku.current_risk * 100).toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground mt-2">Current risk level</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
