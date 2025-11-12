# ml/train.py
import argparse, joblib, numpy as np, pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def load_or_make_sample(n=3000, seed=42):
    rng = np.random.default_rng(seed)
    brands = ["Toyota","Hyundai","Maruti","Honda","Tata","Kia","Ford","Mahindra","Renault","Nissan"]
    models = {
        "Toyota":["Innova","Fortuner","Camry","Corolla","Etios"],
        "Hyundai":["i20","Creta","Verna","Venue","Grand i10"],
        "Maruti":["Swift","Dzire","Baleno","Vitara","Alto"],
        "Honda":["City","Amaze","Jazz","WR-V","Civic"],
        "Tata":["Nexon","Harrier","Altroz","Tiago","Safari"],
        "Kia":["Seltos","Sonet","Carens","Carnival"],
        "Ford":["EcoSport","Endeavour","Figo","Aspire"],
        "Mahindra":["XUV500","Scorpio","Thar","XUV300"],
        "Renault":["Kwid","Duster","Triber","Kiger"],
        "Nissan":["Magnite","Kicks","Terrano"]
    }
    fuel = ["Petrol","Diesel","CNG","Electric"]
    trans = ["Manual","Automatic"]
    
    data = []
    for _ in range(n):
        brand = rng.choice(brands)
        model = rng.choice(models[brand])
        year = rng.integers(2010, 2025)
        km = rng.integers(5_000, 200_000)
        owners = rng.integers(1, 5)
        fuel_type = rng.choice(fuel, p=[0.45, 0.35, 0.15, 0.05])
        transmission = rng.choice(trans, p=[0.65, 0.35])
        engine = rng.integers(800, 2500)
        seats = rng.choice([4,5,7,8], p=[0.1, 0.6, 0.25, 0.05])
        
        # More realistic pricing
        age = 2024 - year
        base = 15 - (age * 0.8)
        km_factor = -km / 50_000
        owner_factor = -(owners - 1) * 1.5
        
        brand_factor = {
            "Toyota":3, "Honda":2.5, "Hyundai":2, "Kia":2.2,
            "Mahindra":1.8, "Tata":1.5, "Maruti":1.2, "Ford":1.8,
            "Renault":1, "Nissan":1.2
        }[brand]
        
        fuel_factor = {"Petrol":0, "Diesel":1.5, "CNG":-0.5, "Electric":3}[fuel_type]
        trans_factor = 1.5 if transmission == "Automatic" else 0
        engine_factor = (engine - 1200) / 800
        seat_factor = (seats - 5) * 0.5
        
        noise = rng.normal(0, 1.5)
        price = base + km_factor + owner_factor + brand_factor + fuel_factor + trans_factor + engine_factor + seat_factor + noise
        price = max(1.5, price)
        
        data.append({
            "brand": brand, "model": model, "year": year, "km_driven": km,
            "owners": owners, "fuel_type": fuel_type, "transmission": transmission,
            "engine_cc": engine, "seats": seats, "price_lakhs": round(price, 2)
        })
    
    return pd.DataFrame(data)

def train(df, target="price_lakhs"):
    X = df.drop(columns=[target])
    y = df[target]
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
    
    num = Xtr.select_dtypes(include=[np.number]).columns.tolist()
    cat = [c for c in Xtr.columns if c not in num]
    
    pre = ColumnTransformer([
        ("num", Pipeline([
            ("imp", SimpleImputer(strategy="median")),
            ("sc", StandardScaler())
        ]), num),
        ("cat", Pipeline([
            ("imp", SimpleImputer(strategy="most_frequent")),
            ("oh", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
        ]), cat),
    ])
    
    model = GradientBoostingRegressor(
        n_estimators=500,
        learning_rate=0.05,
        max_depth=5,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42
    )
    
    pipe = Pipeline([("pre", pre), ("model", model)])
    pipe.fit(Xtr, ytr)
    
    pred = pipe.predict(Xte)
    cv_scores = cross_val_score(pipe, Xtr, ytr, cv=5, scoring='r2')
    
    metrics = {
        "MAE": float(mean_absolute_error(yte, pred)),
        "RMSE": float(np.sqrt(mean_squared_error(yte, pred))),
        "R2": float(r2_score(yte, pred)),
        "CV_R2_Mean": float(cv_scores.mean()),
        "CV_R2_Std": float(cv_scores.std())
    }
    return pipe, metrics, X.columns.tolist()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="ml/model_store/car_model.joblib")
    parser.add_argument("--csv", default="")
    args = parser.parse_args()

    df = pd.read_csv(args.csv) if args.csv else load_or_make_sample()
    print(f"Training with {len(df)} samples...")
    pipe, metrics, feats = train(df)
    joblib.dump({"pipeline": pipe, "features": feats, "target": "price_lakhs"}, args.out)
    print("Model saved:", args.out)
    print("Metrics:", metrics)
