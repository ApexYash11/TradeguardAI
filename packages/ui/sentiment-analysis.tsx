"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface SentimentData {
  avg_sentiment: number
  articles_count: number
  sentiment_trend: string
}

export function SentimentAnalysis() {
  const [sentiment, setSentiment] = useState<SentimentData | null>(null)
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    Promise.all([fetch(`${apiUrl}/api/news/sentiment`), fetch(`${apiUrl}/api/news?limit=10`)])
      .then(async ([sentimentRes, newsRes]) => {
        const sentimentData = await sentimentRes.json()
        const newsData = await newsRes.json()

        setSentiment(sentimentData)
        setArticles(newsData)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching sentiment:", err)
        setLoading(false)
      })
  }, [])

  if (loading || !sentiment) {
    return <div className="text-center py-8 text-muted-foreground">Loading sentiment analysis...</div>
  }

  const getSentimentColor = (score: number) => {
    if (score > 0.6) return "text-green-600"
    if (score < 0.4) return "text-red-600"
    return "text-yellow-600"
  }

  const getSentimentBgColor = (score: number) => {
    if (score > 0.6) return "bg-green-500/20"
    if (score < 0.4) return "bg-red-500/20"
    return "bg-yellow-500/20"
  }

  // Create chart data
  const chartData = [
    {
      name: "Sentiment",
      value: sentiment.avg_sentiment * 100,
      fill: sentiment.avg_sentiment > 0.6 ? "#22c55e" : sentiment.avg_sentiment < 0.4 ? "#ef4444" : "#eab308",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Market Sentiment Analysis</h2>
        <p className="text-sm text-muted-foreground mt-1">AI-powered sentiment scoring from news and trade data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Score Card */}
        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground font-medium">Overall Sentiment</p>
          <div className={`mt-4 p-6 rounded-lg ${getSentimentBgColor(sentiment.avg_sentiment)}`}>
            <p className={`text-4xl font-bold ${getSentimentColor(sentiment.avg_sentiment)}`}>
              {(sentiment.avg_sentiment * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">Market confidence level</p>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-xs text-muted-foreground">
              Trend: <span className="font-semibold capitalize text-foreground">{sentiment.sentiment_trend}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Articles: <span className="font-semibold text-foreground">{sentiment.articles_count}</span>
            </p>
          </div>
        </Card>

        {/* Gauge Chart */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-card border-border">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" domain={[0, 100]} stroke="var(--muted-foreground)" />
                <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                <Bar dataKey="value" fill="#8884d8" radius={[0, 8, 8, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* Recent Articles */}
      <Card className="p-6 bg-card border-border">
        <h3 className="font-semibold text-foreground mb-4">Top Trade News</h3>
        <div className="space-y-3">
          {articles.slice(0, 5).map((article) => (
            <div key={article.id} className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{article.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{article.summary}</p>
                  <p className="text-xs text-muted-foreground mt-2">Source: {article.source}</p>
                </div>
                {article.sentiment !== null && (
                  <div
                    className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                      article.sentiment > 0.6
                        ? "bg-green-500/20 text-green-600"
                        : article.sentiment < 0.4
                          ? "bg-red-500/20 text-red-600"
                          : "bg-yellow-500/20 text-yellow-600"
                    }`}
                  >
                    {(article.sentiment * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
