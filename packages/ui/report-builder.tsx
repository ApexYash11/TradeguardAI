"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"

export function ReportBuilder() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)

  const generateReport = async () => {
    setIsGenerating(true)

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create a mock PDF-like summary
    const reportContent = `
    ===== TRADEGUARDAI DISRUPTION REPORT =====
    Generated: ${new Date().toISOString()}
    
    TOP 5 CRITICAL DISRUPTIONS:
    1. Suez Canal Shipping Delays - Severity: 92% - Shipping blocked
    2. Shanghai Port Container Terminal Closure - Severity: 85% - Weather impact
    3. Port Said Red Sea Tensions - Severity: 81% - Geopolitical risk
    4. Los Angeles Port Strike Alert - Severity: 76% - Labor disruption
    5. Ningbo Port Typhoon Impact - Severity: 88% - Weather threat
    
    AFFECTED COMMODITIES:
    - Electronics: 3 disruptions
    - Textiles: 2 disruptions
    - Shipping & Oil: 1 disruption each
    
    REGIONAL IMPACT:
    - Asia: 4 disruptions
    - Middle East: 2 disruptions
    - Europe: 1 disruption
    - North America: 1 disruption
    
    KEY METRICS:
    - Global Trade Risk Index: 68%
    - Trend: Rising
    - Critical Events: 5
    - Affected Ports: 10
    
    RECOMMENDATIONS:
    1. Monitor Suez Canal shipping closely
    2. Diversify Asia-bound shipments
    3. Prepare contingency plans for electronics supply
    4. Track Red Sea geopolitical developments
    ====================================
    `

    // Trigger download
    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(reportContent))
    element.setAttribute("download", `TradeGuardAI_Report_${new Date().toISOString().split("T")[0]}.txt`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    setReportGenerated(true)
    setIsGenerating(false)

    // Reset after 3 seconds
    setTimeout(() => setReportGenerated(false), 3000)
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generate Report
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Create a comprehensive summary of current disruptions and trends
          </p>
        </div>
        <Button
          onClick={generateReport}
          disabled={isGenerating}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Generating...
            </span>
          ) : reportGenerated ? (
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Downloaded!
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </span>
          )}
        </Button>
      </div>
    </Card>
  )
}
