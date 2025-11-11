from fastapi import APIRouter
from datetime import datetime, timedelta
import sqlite3
from database import get_db
from models import GlobalTradeRiskIndex

router = APIRouter()

@router.get("/api/analytics/gtri", response_model=GlobalTradeRiskIndex)
async def get_global_trade_risk_index():
    """Calculate Global Trade Risk Index from current events"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Get all current events
    cursor.execute('SELECT severity, port FROM events ORDER BY timestamp DESC LIMIT 100')
    events = cursor.fetchall()
    
    if not events:
        return GlobalTradeRiskIndex(gtri=0.0, trend="stable", critical_count=0, affected_ports=0, timestamp=datetime.utcnow().isoformat())
    
    # Calculate GTRI as weighted average
    total_severity = sum(e[0] for e in events)
    gtri = min(total_severity / len(events), 1.0)
    
    # Count critical events and ports
    critical_count = sum(1 for e in events if e[0] > 0.7)
    ports = set(e[1] for e in events)
    
    # Determine trend
    recent_avg = sum(e[0] for e in events[:10]) / min(10, len(events))
    older_avg = sum(e[0] for e in events[10:30]) / min(20, len(events[10:]))
    trend = "rising" if recent_avg > older_avg else "falling" if recent_avg < older_avg else "stable"
    
    conn.close()
    
    return GlobalTradeRiskIndex(
        gtri=round(gtri, 2),
        trend=trend,
        critical_count=critical_count,
        affected_ports=len(ports),
        timestamp=datetime.utcnow().isoformat()
    )

@router.get("/api/analytics/trends")
async def get_historical_trends(days: int = 30):
    """Get historical GTRI trends over time"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Get events from last N days
    past_date = (datetime.utcnow() - timedelta(days=days)).isoformat()
    cursor.execute('SELECT timestamp, severity FROM events WHERE timestamp > ? ORDER BY timestamp', (past_date,))
    events = cursor.fetchall()
    conn.close()
    
    # Aggregate by day
    trends = {}
    for timestamp, severity in events:
        date = timestamp.split('T')[0]
        if date not in trends:
            trends[date] = []
        trends[date].append(severity)
    
    # Calculate daily averages
    result = [{"date": date, "avg_risk": round(sum(risks) / len(risks), 2)} for date, risks in sorted(trends.items())]
    return result

@router.get("/api/analytics/ports")
async def get_port_analytics():
    """Get analytics per port"""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT name, country, risk_score, active_events FROM ports ORDER BY risk_score DESC')
    ports = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return ports
