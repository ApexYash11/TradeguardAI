from fastapi import APIRouter
from database import get_db
from models import Port

router = APIRouter()

@router.get("/api/ports", response_model=list[Port])
async def get_ports():
    """Get all ports with current risk scores"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, country, latitude, longitude, risk_score, active_events FROM ports')
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

@router.get("/api/ports/{port_id}", response_model=Port)
async def get_port(port_id: int):
    """Get specific port details"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, country, latitude, longitude, risk_score, active_events FROM ports WHERE id = ?', (port_id,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return dict(row)
    return {"error": "Port not found"}

@router.get("/api/ports/{port_id}/events")
async def get_port_events(port_id: int):
    """Get events for a specific port"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Get port name first
    cursor.execute('SELECT name FROM ports WHERE id = ?', (port_id,))
    port = cursor.fetchone()
    
    if not port:
        return {"error": "Port not found"}
    
    # Get events for this port
    cursor.execute('SELECT * FROM events WHERE port = ? ORDER BY timestamp DESC', (port['name'],))
    events = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return {"port": port['name'], "events": events}
