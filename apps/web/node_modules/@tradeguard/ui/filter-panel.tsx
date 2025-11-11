"use client"

import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface Filters {
  region: string
  severity: string
  commodity: string
  dateRange: string
}

interface FilterPanelProps {
  filters: Filters
  onFilterChange: (filters: Filters) => void
}

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const regions = ["All Regions", "Asia", "Europe", "North America", "Middle East"]
  const severities = ["All Severity", "Stable (<30%)", "Caution (30-70%)", "Critical (>70%)"]
  const commodities = [
    "All Commodities",
    "Electronics",
    "Textiles",
    "Chemicals",
    "Automotive",
    "Machinery",
    "Oil",
    "Furniture",
  ]
  const dateRanges = ["7 days", "30 days", "90 days", "1 year"]

  const handleReset = () => {
    onFilterChange({
      region: "all",
      severity: "all",
      commodity: "all",
      dateRange: "30days",
    })
  }

  return (
    <Card className="p-6 bg-card border-border sticky top-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        <button onClick={handleReset} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Region Filter */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Region</label>
        <select
          value={filters.region}
          onChange={(e) => onFilterChange({ ...filters, region: e.target.value })}
          className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {regions.map((region) => (
            <option key={region} value={region.toLowerCase()}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* Severity Filter */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Severity Level</label>
        <select
          value={filters.severity}
          onChange={(e) => onFilterChange({ ...filters, severity: e.target.value })}
          className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {severities.map((severity) => (
            <option key={severity} value={severity.toLowerCase()}>
              {severity}
            </option>
          ))}
        </select>
      </div>

      {/* Commodity Filter */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Commodity Type</label>
        <select
          value={filters.commodity}
          onChange={(e) => onFilterChange({ ...filters, commodity: e.target.value })}
          className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {commodities.map((commodity) => (
            <option key={commodity} value={commodity.toLowerCase()}>
              {commodity}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range Filter */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Date Range</label>
        <select
          value={filters.dateRange}
          onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value })}
          className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {dateRanges.map((range) => (
            <option key={range} value={range.toLowerCase().replace(" ", "")}>
              {range}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Summary */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Active filters:{" "}
          <span className="font-semibold text-foreground">
            {
              [
                filters.region !== "all",
                filters.severity !== "all",
                filters.commodity !== "all",
                filters.dateRange !== "30days",
              ].filter(Boolean).length
            }
          </span>
        </p>
      </div>
    </Card>
  )
}
