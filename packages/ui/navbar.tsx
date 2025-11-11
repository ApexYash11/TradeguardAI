"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"

export function Navbar() {
  const [lastUpdate, setLastUpdate] = useState<string>("12:02:18 AM")

  const handleRefresh = () => {
    const now = new Date()
    setLastUpdate(now.toLocaleTimeString())
    // Trigger page refresh or API call here
    window.location.reload()
  }

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TG</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">TradeGuardAI</h1>
          <p className="text-sm text-muted-foreground ml-2">Global Trade Disruption Monitoring & Forecasting System</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Last updated: {lastUpdate}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  )
}
