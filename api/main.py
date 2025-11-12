# api/main.py
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import pandas as pd, joblib
from api.database import save_prediction, get_all_predictions

BASE = Path(__file__).resolve().parents[1]
FRONTEND_DIST = BASE / "frontend" / "dist"
MODEL_PATH = BASE / "ml" / "model_store" / "car_model.joblib"

app = FastAPI(title="Car Sales Prediction")

# --- API first (explicit routes take priority over static) ---
class PredictIn(BaseModel):
    brand: str | None = None
    model: str | None = None
    year: int
    km_driven: int
    owners: int
    fuel_type: str | None = None
    transmission: str | None = None
    engine_cc: int | None = None
    seats: int | None = None

mdl = joblib.load(MODEL_PATH)
PIPE = mdl["pipeline"]; FEATS = mdl["features"]

@app.get("/health")
def health():
    return {"ok": True, "features": FEATS}

@app.post("/predict")
def predict(x: PredictIn):
    row = {f: None for f in FEATS}; row.update(x.dict())
    df = pd.DataFrame([row], columns=FEATS)
    y = float(PIPE.predict(df)[0])
    save_prediction(x.dict(), y)
    return {"predicted_price_lakhs": y}

@app.get("/history")
def history():
    rows = get_all_predictions()
    return {"predictions": [{"id": r[0], "brand": r[1], "model": r[2], "year": r[3], 
                              "km_driven": r[4], "owners": r[5], "fuel_type": r[6],
                              "transmission": r[7], "engine_cc": r[8], "seats": r[9],
                              "predicted_price": r[10], "timestamp": r[11]} for r in rows]}

# --- Serve React build (after API routes) ---
app.mount("/", StaticFiles(directory=str(FRONTEND_DIST), html=True), name="static")

@app.get("/")
def index():
    return FileResponse(str(FRONTEND_DIST / "index.html"))
