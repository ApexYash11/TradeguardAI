from fastapi import APIRouter, WebSocket
from datetime import datetime, timedelta
import json
import asyncio
import random
from database import get_db
from models import Event

router = APIRouter()

# Store active WebSocket connections
active_connections: list[WebSocket] = []

@router.websocket("/ws/events")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time event streaming"""
    await websocket.accept()
    active_connections.append(websocket)
    
    try:
        # Send initial connection message
        await websocket.send_json({
            "type": "connection",
            "message": "Connected to TradeGuardAI event stream",
            "timestamp": datetime.utcnow().isoformat()
        })
        
        # Simulate real-time event streaming every 15 seconds
        while True:
            await asyncio.sleep(15)
            
            # Get random event from database
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM events ORDER BY RANDOM() LIMIT 1')
            row = cursor.fetchone()
            conn.close()
            
            if row:
                event_data = {
                    "type": "event",
                    "id": row[0],
                    "title": row[1],
                    "summary": row[2],
                    "severity": row[3],
                    "port": row[4],
                    "commodity": row[5],
                    "timestamp": row[10]  # timestamp is at index 10
                }
                
                # Broadcast to all connected clients
                await broadcast_event(event_data)
    
    except Exception as e:
        print(f"[v0] WebSocket error: {e}")
    finally:
        active_connections.remove(websocket)

async def broadcast_event(event: dict):
    """Broadcast event to all connected WebSocket clients"""
    for connection in active_connections:
        try:
            await connection.send_json(event)
        except Exception as e:
            print(f"[v0] Failed to send event to client: {e}")
