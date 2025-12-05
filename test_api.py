import urllib.request
import json

url = "http://localhost:8000/predict"
data = {
    "brand": "Maruti",
    "model": "Swift",
    "year": 2018,
    "km_driven": 50000,
    "owners": 1,
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "engine_cc": 1200,
    "seats": 5
}

req = urllib.request.Request(url, method="POST")
req.add_header('Content-Type', 'application/json')
jsondata = json.dumps(data).encode('utf-8')
req.add_header('Content-Length', len(jsondata))

try:
    print(f"Sending request to {url}...")
    response = urllib.request.urlopen(req, jsondata)
    print("Status Code:", response.getcode())
    print("Response:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code, e.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
