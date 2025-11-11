from fastapi import APIRouter
from datetime import datetime, timedelta
import random
from database import get_db
from models import Forecast, ForecastPoint

router = APIRouter()

@router.get("/api/forecast/{sku_id}", response_model=Forecast)
async def get_forecast(sku_id: int):
    """Generate mock forecast data for a SKU"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM skus WHERE id = ?', (sku_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return {"error": "SKU not found"}
    
    # Generate 30-day forecast with trend
    forecast_data = []
    base_date = datetime.utcnow()
    base_risk = random.uniform(0.3, 0.8)
    trend = random.uniform(-0.01, 0.02)
    
    for i in range(30):
        date = base_date + timedelta(days=i)
        risk = max(0.1, min(0.95, base_risk + (trend * i) + random.uniform(-0.05, 0.05)))
        
        forecast_data.append(ForecastPoint(
            date=date.strftime("%Y-%m-%d"),
            risk=round(risk, 3)
        ))
    
    sku = dict(row)
    return Forecast(
        sku_id=sku_id,
        sku_name=sku["name"],
        forecast_data=forecast_data
    )
