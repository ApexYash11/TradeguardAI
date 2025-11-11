"use client"

import { Card } from "@/components/ui/card"
import { Globe } from "lucide-react"

export function GlobalMap() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Global Risk Map</h2>
        <p className="text-sm text-muted-foreground mt-1">Worldwide trade disruption hotspots and risk zones</p>
      </div>

      <Card className="p-8 bg-card border-border">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Globe className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Global map visualization coming soon</p>
          <p className="text-sm text-muted-foreground mt-2">Monitor international trade routes and disruption zones</p>
        </div>
      </Card>
    </div>
  )
}
