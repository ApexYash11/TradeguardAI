from fastapi import APIRouter
from backend.database import get_db
from backend.models import Event

router = APIRouter()

@router.get("/api/events", response_model=list[Event])
async def get_events(limit: int = 10):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM events ORDER BY timestamp DESC LIMIT ?', (limit,))
    rows = cursor.fetchall()
    conn.close()
    
    events = [dict(row) for row in rows]
    return events

@router.get("/api/events/{event_id}", response_model=Event)
async def get_event(event_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM events WHERE id = ?', (event_id,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return dict(row)
    return {"error": "Event not found"}
