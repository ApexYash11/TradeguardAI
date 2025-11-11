import sqlite3
from pathlib import Path
from backend.seed_data import seed_database

DB_PATH = Path(__file__).parent / "trade_guard.db"

def get_db():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database and seed with data if empty"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if tables exist
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
    if cursor.fetchone() is None:
        # Create users table
        cursor.execute('''
            CREATE TABLE users (
                id INTEGER PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                hashed_password TEXT NOT NULL,
                is_admin BOOLEAN DEFAULT 0,
                created_at TEXT NOT NULL
            )
        ''')
    
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='events'")
    if cursor.fetchone() is None:
        cursor.execute('''
            CREATE TABLE events (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                summary TEXT NOT NULL,
                severity REAL NOT NULL,
                port TEXT NOT NULL,
                commodity TEXT NOT NULL,
                region TEXT,
                source TEXT,
                sentiment_score REAL,
                tags TEXT,
                timestamp TEXT NOT NULL
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE skus (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                commodity TEXT NOT NULL,
                ports TEXT NOT NULL,
                risk_level REAL NOT NULL
            )
        ''')

        cursor.execute('''
            CREATE TABLE ports (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                country TEXT NOT NULL,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                risk_score REAL NOT NULL,
                active_events INTEGER DEFAULT 0
            )
        ''')

        cursor.execute('''
            CREATE TABLE articles (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                source TEXT NOT NULL,
                url TEXT,
                summary TEXT NOT NULL,
                sentiment REAL,
                published_at TEXT NOT NULL
            )
        ''')

        cursor.execute('''
            CREATE TABLE forecasts_history (
                id INTEGER PRIMARY KEY,
                sku_id INTEGER NOT NULL,
                forecast_date TEXT NOT NULL,
                risk REAL NOT NULL,
                upper_bound REAL,
                lower_bound REAL,
                created_at TEXT NOT NULL
            )
        ''')
        
        conn.commit()
        seed_database(conn)
    
    conn.close()
