import ai_engine
import pprint

print("===== Testing AI Engine =====")

test_cases = [
    {"soil_moisture": 30, "temperature": 40, "air_humidity": 80, "crop": "wheat"},
    {"soil_moisture": 60, "temperature": 25, "air_humidity": 50, "crop": "wheat"},
    {"soil_moisture": 45, "temperature": 35, "air_humidity": 90, "crop": "rice"}
]

for idx, tc in enumerate(test_cases, 1):
    print(f"\n[Test Case {idx}] Parameters:")
    pprint.pprint(tc)
    try:
        result = ai_engine.predict_irrigation(**tc)
        print("  => Prediction Results:")
        pprint.pprint(result)
    except Exception as e:
        print(f"  => Error: {e}")
