import json
from datetime import datetime, timedelta
import random

EVENTS_DATA = [
    {
        "title": "Shanghai Port Strike",
        "summary": "Dock workers initiated a 48-hour strike causing severe delays at one of the world's busiest ports.",
        "severity": 0.81,
        "port": "Shanghai",
        "commodity": "Electronics"
    },
    {
        "title": "Panama Canal Congestion",
        "summary": "Increased traffic and low water levels causing significant vessel queuing and delays.",
        "severity": 0.68,
        "port": "Panama City",
        "commodity": "Oil"
    },
    {
        "title": "Port of Rotterdam Weather Delays",
        "summary": "Severe winter storm causing operational delays and equipment failures.",
        "severity": 0.45,
        "port": "Rotterdam",
        "commodity": "Grains"
    },
    {
        "title": "Suez Canal Traffic Incident",
        "summary": "Vessel collision requiring emergency response and temporary lane closure.",
        "severity": 0.72,
        "port": "Suez",
        "commodity": "Oil"
    },
    {
        "title": "Los Angeles Port Labor Negotiations",
        "summary": "Contract discussions between management and workers causing scheduling uncertainty.",
        "severity": 0.55,
        "port": "Los Angeles",
        "commodity": "Auto Parts"
    },
    {
        "title": "Singapore Port System Malfunction",
        "summary": "IT system outage affecting cargo tracking and vessel scheduling for 8 hours.",
        "severity": 0.62,
        "port": "Singapore",
        "commodity": "Electronics"
    },
    {
        "title": "Dubai Port Customs Backlog",
        "summary": "Increased security protocols causing extended inspection times.",
        "severity": 0.38,
        "port": "Dubai",
        "commodity": "Pharmaceuticals"
    },
    {
        "title": "Hamburg Port Crane Maintenance",
        "summary": "Critical crane inspection causing operational capacity reduction by 30%.",
        "severity": 0.51,
        "port": "Hamburg",
        "commodity": "Auto Parts"
    },
    {
        "title": "Port of Hong Kong Typhoon Warning",
        "summary": "Typhoon expected to impact operations; pre-positioning of vessels in progress.",
        "severity": 0.74,
        "port": "Hong Kong",
        "commodity": "Electronics"
    },
    {
        "title": "Santos Port Labor Agreement",
        "summary": "New labor agreement reached but temporary worker shortage continues.",
        "severity": 0.33,
        "port": "Santos",
        "commodity": "Grains"
    }
]

SKUS_DATA = [
    {"name": "Consumer Electronics - General", "commodity": "Electronics", "ports": "Shanghai,Singapore,Hong Kong"},
    {"name": "Crude Oil - Brent", "commodity": "Oil", "ports": "Dubai,Rotterdam,Suez"},
    {"name": "Wheat and Cereals", "commodity": "Grains", "ports": "Rotterdam,Santos,Hamburg"},
    {"name": "Automotive Components", "commodity": "Auto Parts", "ports": "Los Angeles,Hamburg,Shanghai"},
    {"name": "Pharmaceutical Products", "commodity": "Pharmaceuticals", "ports": "Dubai,Rotterdam,Singapore"}
]

def seed_database(conn):
    """Seed database with initial trade data"""
    cursor = conn.cursor()
    
    # Seed events with timestamps from last 30 days
    base_date = datetime.utcnow()
    for i, event in enumerate(EVENTS_DATA):
        days_ago = random.randint(0, 30)
        timestamp = (base_date - timedelta(days=days_ago)).isoformat() + "Z"
        
        cursor.execute('''
            INSERT INTO events (title, summary, severity, port, commodity, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (event["title"], event["summary"], event["severity"], event["port"], event["commodity"], timestamp))
    
    # Seed SKUs
    for sku in SKUS_DATA:
        risk = round(random.uniform(0.2, 0.85), 2)
        cursor.execute('''
            INSERT INTO skus (name, commodity, ports, risk_level)
            VALUES (?, ?, ?, ?)
        ''', (sku["name"], sku["commodity"], sku["ports"], risk))
    
    conn.commit()
