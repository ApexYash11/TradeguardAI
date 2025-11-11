from fastapi import APIRouter
from backend.database import get_db
from backend.models import SKU

router = APIRouter()

@router.get("/api/sku", response_model=list[SKU])
async def get_skus():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM skus ORDER BY risk_level DESC')
    rows = cursor.fetchall()
    conn.close()
    
    skus = [dict(row) for row in rows]
    return skus

@router.get("/api/sku/{sku_id}", response_model=SKU)
async def get_sku(sku_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM skus WHERE id = ?', (sku_id,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return dict(row)
    return {"error": "SKU not found"}
