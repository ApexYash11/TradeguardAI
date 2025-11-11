"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { StatCards } from "@/components/stat-cards"
import { EventFeed } from "@/components/event-feed"
import { SkuForecast } from "@/components/sku-forecast"
import { GlobalRiskMap } from "@/components/global-risk-map"
import { MultiSKUForecast } from "@/components/multi-sku-forecast"
import { RiskTrendsChart } from "@/components/risk-trends-chart"
import { EventNotificationBadge } from "@/components/event-notification-badge"

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<"events" | "forecast" | "map" | "analytics">("events")

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="p-6 max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">TradeGuardAI</h1>
            <p className="text-muted-foreground mt-1">Global Trade Disruption Monitoring & Forecasting System</p>
          </div>
          <EventNotificationBadge />
        </div>

        <StatCards />

        <div className="mt-8 border-b border-border">
          <div className="flex gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab("events")}
              className={`px-0 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "events"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Event Feed
            </button>
            <button
              onClick={() => setActiveTab("forecast")}
              className={`px-0 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "forecast"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              SKU Forecast
            </button>
            <button
              onClick={() => setActiveTab("map")}
              className={`px-0 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "map"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Global Map
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-0 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "analytics"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Analytics
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {activeTab === "events" && <EventFeed />}
          {activeTab === "forecast" && <SkuForecast />}
          {activeTab === "map" && <GlobalRiskMap />}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <MultiSKUForecast />
              <RiskTrendsChart />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function Dashboard() {
  return <DashboardContent />
}
