"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { FilterPanel } from "@/components/filter-panel"
import { AdvancedAnalytics } from "@/components/advanced-analytics"
import { SentimentAnalysis } from "@/components/sentiment-analysis"
import { MultiSKUForecast } from "@/components/multi-sku-forecast"
import { RiskTrendsChart } from "@/components/risk-trends-chart"
import { ReportBuilder } from "@/components/report-builder"

export default function AnalyticsPage() {
  const [filters, setFilters] = useState({
    region: "all",
    severity: "all",
    commodity: "all",
    dateRange: "30days",
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Comprehensive trade disruption analytics and reporting</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel filters={filters} onFilterChange={setFilters} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Risk Trends */}
            <RiskTrendsChart />

            {/* Multi-SKU Comparison */}
            <MultiSKUForecast />

            {/* Sentiment Analysis */}
            <SentimentAnalysis />

            {/* Advanced Analytics */}
            <AdvancedAnalytics />

            {/* Report Builder */}
            <ReportBuilder />
          </div>
        </div>
      </main>
    </div>
  )
}
