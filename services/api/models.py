from pydantic import BaseModel
from typing import List, Optional

class Event(BaseModel):
    id: int
    title: str
    summary: str
    severity: float
    port: str
    commodity: str
    timestamp: str
    region: Optional[str] = None
    source: Optional[str] = None
    sentiment_score: Optional[float] = None
    tags: Optional[List[str]] = None

class SKU(BaseModel):
    id: int
    name: str
    commodity: str
    ports: str
    risk_level: float

class ForecastPoint(BaseModel):
    date: str
    risk: float
    upper_bound: Optional[float] = None
    lower_bound: Optional[float] = None

class Forecast(BaseModel):
    sku_id: int
    sku_name: str
    forecast_data: List[ForecastPoint]

class Port(BaseModel):
    id: int
    name: str
    country: str
    latitude: float
    longitude: float
    risk_score: float
    active_events: int

class Article(BaseModel):
    id: int
    title: str
    source: str
    url: Optional[str] = None
    summary: str
    published_at: str
    sentiment: Optional[float] = None

class GlobalTradeRiskIndex(BaseModel):
    gtri: float
    trend: str
    critical_count: int
    affected_ports: int
    timestamp: str

class SKUComparison(BaseModel):
    skus: List[dict]
    timestamp: str
