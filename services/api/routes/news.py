from fastapi import APIRouter
from database import get_db
from models import Article

router = APIRouter()

@router.get("/api/news", response_model=list[Article])
async def get_news(limit: int = 20):
    """Get latest trade-related news articles"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT id, title, source, url, summary, sentiment, published_at FROM articles ORDER BY published_at DESC LIMIT ?', (limit,))
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

@router.get("/api/news/sentiment")
async def get_sentiment_analysis():
    """Get overall market sentiment from articles"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT sentiment FROM articles WHERE sentiment IS NOT NULL')
    rows = cursor.fetchall()
    conn.close()
    
    if not rows:
        return {"avg_sentiment": 0.5, "articles_count": 0}
    
    sentiments = [row[0] for row in rows]
    avg_sentiment = sum(sentiments) / len(sentiments)
    
    return {
        "avg_sentiment": round(avg_sentiment, 2),
        "articles_count": len(sentiments),
        "sentiment_trend": "positive" if avg_sentiment > 0.6 else "negative" if avg_sentiment < 0.4 else "neutral"
    }
