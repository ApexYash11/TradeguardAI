"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface Port {
  id: number
  name: string
  country: string
  latitude: number
  longitude: number
  risk_score: number
  active_events: number
}

export function GlobalRiskMap() {
  const [ports, setPorts] = useState<Port[]>([])
  const [selectedPort, setSelectedPort] = useState<Port | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    fetch(`${apiUrl}/api/ports`)
      .then((res) => res.json())
      .then((data) => {
        setPorts(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching ports:", err)
        setLoading(false)
      })
  }, [])

  const getRiskColor = (risk: number) => {
    if (risk > 0.7) return "bg-red-500"
    if (risk > 0.3) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getRiskLabel = (risk: number) => {
    if (risk > 0.7) return "Critical"
    if (risk > 0.3) return "Caution"
    return "Stable"
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading global map...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Port List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {ports.map((port) => (
            <button
              key={port.id}
              onClick={() => setSelectedPort(port)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedPort?.id === port.id
                  ? "bg-primary/10 border-primary shadow-lg"
                  : "bg-card border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{port.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{port.country}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${getRiskColor(port.risk_score)}`}></div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Risk: <span className="font-semibold">{(port.risk_score * 100).toFixed(0)}%</span> • Events:{" "}
                <span className="font-semibold">{port.active_events}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Port Details */}
        {selectedPort && (
          <div className="lg:col-span-2">
            <Card className="p-6 bg-card border-border">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedPort.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedPort.country}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground">Risk Level</p>
                    <p
                      className={`text-2xl font-bold mt-2 ${getRiskColor(selectedPort.risk_score).replace("bg-", "text-")}`}
                    >
                      {getRiskLabel(selectedPort.risk_score)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{(selectedPort.risk_score * 100).toFixed(1)}%</p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground">Active Events</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{selectedPort.active_events}</p>
                    <p className="text-xs text-muted-foreground mt-1">Current disruptions</p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-2">Coordinates</p>
                  <p className="text-sm font-mono text-foreground">
                    {selectedPort.latitude.toFixed(4)}°N, {selectedPort.longitude.toFixed(4)}°E
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Map Visualization */}
      <Card className="p-6 bg-card border-border">
        <h3 className="font-semibold text-foreground mb-4">Global Port Distribution</h3>
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <div className="grid grid-cols-5 gap-4">
            {ports.map((port) => (
              <div
                key={port.id}
                className="flex flex-col items-center p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                onClick={() => setSelectedPort(port)}
              >
                <div className={`w-4 h-4 rounded-full ${getRiskColor(port.risk_score)} mb-2`}></div>
                <p className="text-xs font-medium text-foreground text-center line-clamp-2">{port.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{(port.risk_score * 100).toFixed(0)}%</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
