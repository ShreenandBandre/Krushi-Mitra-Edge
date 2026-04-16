import requests
import random
import time

URL = "http://127.0.0.1:8000/api/predict"

while True:
    data = {
        "soil_moisture": random.uniform(20, 80),
        "temperature": random.uniform(20, 40),
        "air_humidity": random.uniform(40, 90),
        "crop": random.choice(["wheat", "rice", "cotton"])
    }

    res = requests.post(URL, json=data)
    print("Sent:", data)
    print("Response:", res.json())
    print("-" * 50)

    time.sleep(3)  # every 3 sec