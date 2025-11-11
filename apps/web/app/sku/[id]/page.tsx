"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface SKU {
  id: number
  name: string
  commodity: string
  ports: string
  risk_level: number
}

interface ForecastPoint {
  date: string
  risk: number
}

function getRiskColor(risk: number): string {
  if (risk < 0.3) return "text-green-600"
  if (risk < 0.7) return "text-yellow-600"
  return "text-red-600"
}

export default function SKUDetailPage() {
  const params = useParams()
  const skuId = params.id
  const [sku, setSku] = useState<SKU | null>(null)
  const [forecast, setForecast] = useState<ForecastPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!skuId) return

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    Promise.all([
      fetch(`${apiUrl}/api/sku/${skuId}`).then((res) => res.json()),
      fetch(`${apiUrl}/api/forecast/${skuId}`).then((res) => res.json()),
    ])
      .then(([skuData, forecastData]) => {
        setSku(skuData)
        if (forecastData.forecast_data) {
          setForecast(forecastData.forecast_data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching data:", err)
        setLoading(false)
      })
  }, [skuId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-6 py-4">
          <Link href="/">
            <Button variant="ghost">← Back to Dashboard</Button>
          </Link>
        </div>
        <div className="px-6 py-4">Loading SKU forecast...</div>
      </div>
    )
  }

  if (!sku) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-6 py-4">
          <Link href="/">
            <Button variant="ghost">← Back to Dashboard</Button>
          </Link>
          <Card className="p-6 mt-6">
            <p className="text-muted-foreground">SKU not found</p>
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

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="p-8 mb-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{sku.name}</h1>
              <p className="text-muted-foreground mt-2">Risk Forecast Analysis</p>
            </div>
            <div className={`text-4xl font-bold ${getRiskColor(sku.risk_level)}`}>
              {(sku.risk_level * 100).toFixed(0)}%
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Commodity</p>
              <p className="text-lg font-semibold text-foreground mt-1">{sku.commodity}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Associated Ports</p>
              <p className="text-lg font-semibold text-foreground mt-1">{sku.ports}</p>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">30-Day Risk Forecast</h2>
          {forecast.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={forecast} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                  domain={[0, 1]}
                  label={{ value: "Risk Level", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--muted))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value) => `${(value * 100).toFixed(1)}%`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="risk"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Risk"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No forecast data available</div>
          )}
        </Card>
      </div>
    </div>
  )
}
