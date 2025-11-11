"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"

interface SKU {
  id: number
  name: string
  commodity: string
  risk_level: number
}

function getRiskColor(risk: number): string {
  if (risk < 0.3) return "bg-green-500/20 text-green-600"
  if (risk < 0.7) return "bg-yellow-500/20 text-yellow-600"
  return "bg-red-500/20 text-red-600"
}

function getRiskLabel(risk: number): string {
  if (risk < 0.3) return "Stable"
  if (risk < 0.7) return "Caution"
  return "Critical"
}

export function TopRiskSkus() {
  const [skus, setSkus] = useState<SKU[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    fetch(`${apiUrl}/api/sku`)
      .then((res) => res.json())
      .then((data) => {
        setSkus(data.slice(0, 5))
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching SKUs:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Top Risk SKUs</h2>
        <div className="text-muted-foreground">Loading SKUs...</div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Top Risk SKUs</h2>
      <div className="space-y-3">
        {skus.map((sku) => (
          <Link href={`/sku/${sku.id}`} key={sku.id}>
            <div className="p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer border border-border">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm truncate">{sku.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{sku.commodity}</p>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getRiskColor(sku.risk_level)}`}
                >
                  {(sku.risk_level * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}
