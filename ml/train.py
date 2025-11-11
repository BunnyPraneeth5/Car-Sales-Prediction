# ml/train.py
import argparse, joblib, numpy as np, pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def load_or_make_sample(n=1500, seed=42):
    rng = np.random.default_rng(seed)
    brands = ["Toyota","Hyundai","Maruti","Honda","Tata","Kia","Ford"]
    fuel = ["Petrol","Diesel","CNG"]
    trans = ["Manual","Automatic"]
    df = pd.DataFrame({
        "brand": rng.choice(brands, n),
        "model": [f"Model{m}" for m in rng.integers(1,12,n)],
        "year": rng.integers(2008, 2025, n),
        "km_driven": rng.integers(5_000, 180_000, n),
        "owners": rng.integers(1, 4, n),
        "fuel_type": rng.choice(fuel, n),
        "transmission": rng.choice(trans, n),
        "engine_cc": rng.integers(800, 2500, n),
        "seats": rng.integers(4, 8, n),
    })
    base = 12 + (df["year"]-2008)*0.7 - (df["km_driven"]/40_000)*2
    brand_bump = (df["brand"].eq("Toyota"))*1.5 + (df["brand"].eq("Honda"))*1.2 + (df["brand"].eq("Maruti"))*0.8
    fuel_bump = (df["fuel_type"].eq("Diesel"))*0.6 + (df["fuel_type"].eq("CNG"))*(-0.4)
    trans_bump = (df["transmission"].eq("Automatic"))*1.0
    engine_bump = (df["engine_cc"] - 1200)/1000
    seat_bump = (df["seats"] - 5)*0.3
    noise = rng.normal(0, 1.2, n)
    df["price_lakhs"] = (base + brand_bump + fuel_bump + trans_bump + engine_bump + seat_bump + noise).clip(1.5,None).round(2)
    return df

def train(df, target="price_lakhs"):
    X = df.drop(columns=[target])
    y = df[target]
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
    num = Xtr.select_dtypes(include=[np.number]).columns.tolist()
    cat = [c for c in Xtr.columns if c not in num]
    pre = ColumnTransformer([
        ("num", Pipeline([("imp", SimpleImputer(strategy="median")),
                          ("sc", StandardScaler())]), num),
        ("cat", Pipeline([("imp", SimpleImputer(strategy="most_frequent")),
                          ("oh", OneHotEncoder(handle_unknown="ignore"))]), cat),
    ])
    model = RandomForestRegressor(n_estimators=300, random_state=42, n_jobs=-1)
    pipe = Pipeline([("pre", pre), ("model", model)])
    pipe.fit(Xtr, ytr)
    pred = pipe.predict(Xte)
    metrics = {
        "MAE": float(mean_absolute_error(yte, pred)),
        "RMSE": float(mean_squared_error(yte, pred, squared=False)),
        "R2": float(r2_score(yte, pred)),
    }
    return pipe, metrics, X.columns.tolist()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="ml/model_store/car_model.joblib")
    parser.add_argument("--csv", default="")
    args = parser.parse_args()

    df = pd.read_csv(args.csv) if args.csv else load_or_make_sample()
    pipe, metrics, feats = train(df)
    joblib.dump({"pipeline": pipe, "features": feats, "target": "price_lakhs"}, args.out)
    print("Saved:", args.out)
    print("Metrics:", metrics)
