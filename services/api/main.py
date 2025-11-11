import sys
from pathlib import Path

# Add the services/api directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import sqlite3
from pathlib import Path
from database import init_db
from routes import events, forecast, skus, health, analytics, ports, news, websocket, auth

# Initialize database on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    yield
    # Shutdown

app = FastAPI(
    title="TradeGuardAI API",
    description="Trade disruption monitoring API",
    version="2.1.0",
    lifespan=lifespan
)

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["localhost", "127.0.0.1", "*.vercel.app", "*"])

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "https://*.vercel.app", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(health.router)
app.include_router(events.router)
app.include_router(forecast.router)
app.include_router(skus.router)
app.include_router(analytics.router)
app.include_router(ports.router)
app.include_router(news.router)
app.include_router(websocket.router)

@app.get("/")
async def root():
    return {"message": "TradeGuardAI API", "status": "running", "version": "2.1.0"}
