"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SKU {
  id: number
  name: string
  risk_score: number
  forecast: Array<{ day: string; value: number }>
}

export function SkuForecast() {
  const [skus, setSkus] = useState<SKU[]>([])
  const [selectedSku, setSelectedSku] = useState<SKU | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    fetch(`${apiUrl}/api/skus`)
      .then((res) => res.json())
      .then((data) => {
        setSkus(data)
        if (data.length > 0) {
          setSelectedSku(data[0])
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching SKUs:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading SKU forecasts...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">SKU Risk Forecasts</h2>
        <p className="text-sm text-muted-foreground mt-1">30-day predictive risk analysis for critical SKUs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          {skus.map((sku) => (
            <button
              key={sku.id}
              onClick={() => setSelectedSku(sku)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedSku?.id === sku.id
                  ? "bg-primary/10 border-primary text-foreground"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <p className="font-medium">{sku.name}</p>
              <p className="text-xs mt-1">Risk: {(sku.risk_score * 100).toFixed(0)}%</p>
            </button>
          ))}
        </div>

        {selectedSku && (
          <div className="lg:col-span-2">
            <Card className="p-6 bg-card border-border">
              <h3 className="font-semibold text-foreground mb-4">{selectedSku.name} - 30 Day Forecast</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={selectedSku.forecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                  <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
