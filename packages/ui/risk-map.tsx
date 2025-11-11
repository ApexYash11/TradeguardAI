"use client"

import { Card } from "@/components/ui/card"

export function RiskMap() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Global Risk Map</h2>
      <div className="bg-muted rounded-lg p-8 flex items-center justify-center border border-border">
        <div className="text-center">
          <div className="text-4xl font-bold text-muted-foreground mb-2">🌍</div>
          <p className="text-sm text-muted-foreground">Interactive map showing:</p>
          <p className="text-xs text-muted-foreground mt-1">Port locations & risk levels</p>
          <p className="text-xs text-muted-foreground">Trade corridor congestion</p>
          <p className="text-xs text-muted-foreground">Active disruption zones</p>
        </div>
      </div>
    </Card>
  )
}
