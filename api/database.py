import sqlite3
from pathlib import Path
from datetime import datetime

DB_PATH = Path(__file__).resolve().parents[1] / "data" / "predictions.db"
DB_PATH.parent.mkdir(exist_ok=True)

def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            brand TEXT,
            model TEXT,
            year INTEGER,
            km_driven INTEGER,
            owners INTEGER,
            fuel_type TEXT,
            transmission TEXT,
            engine_cc INTEGER,
            seats INTEGER,
            predicted_price REAL,
            timestamp TEXT
        )
    """)
    conn.commit()
    conn.close()

def save_prediction(data, price):
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        INSERT INTO predictions 
        (brand, model, year, km_driven, owners, fuel_type, transmission, engine_cc, seats, predicted_price, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.get("brand"), data.get("model"), data.get("year"), 
        data.get("km_driven"), data.get("owners"), data.get("fuel_type"),
        data.get("transmission"), data.get("engine_cc"), data.get("seats"),
        price, datetime.now().isoformat()
    ))
    conn.commit()
    conn.close()

def get_all_predictions():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.execute("SELECT * FROM predictions ORDER BY timestamp DESC")
    rows = cursor.fetchall()
    conn.close()
    return rows

init_db()
