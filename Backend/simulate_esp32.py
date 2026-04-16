import requests
import time
import random
import json

# Replace with your Raspberry Pi's IP address if running on a different machine
# For testing locally, localhost (127.0.0.1) is fine.
PI_API_URL = "http://127.0.0.1:8000/api/predict"

def simulate_node():
    print(f"--- Simulating ESP32 Node ---")
    
    # Generate mock sensor readings
    soil_moisture = random.uniform(20.0, 80.0)
    temperature = random.uniform(25.0, 40.0)
    air_humidity = random.uniform(40.0, 90.0)
    crop = "wheat"

    payload = {
        "soil_moisture": round(soil_moisture, 2),
        "temperature": round(temperature, 2),
        "air_humidity": round(air_humidity, 2),
        "crop": crop
    }

    try:
        print(f"Sending Payload: {json.dumps(payload, indent=2)}")
        response = requests.post(PI_API_URL, json=payload, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print(f"Prediction Result: {json.dumps(data, indent=2)}")
            
            # Simulated pump logic
            irrigate = data.get("irrigate", False)
            if irrigate:
                print("ACTION => ESP32 turned ON Water Pump relay.")
            else:
                print("ACTION => ESP32 turned OFF Water Pump relay.")
        else:
            print(f"Error ({response.status_code}): {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"Connection failed. Is the FastAPI server running? Error: {e}")

if __name__ == "__main__":
    print("ESP32 Test Simulator Started. Press Ctrl+C to stop.\n")
    try:
        while True:
            simulate_node()
            print("-" * 40)
            time.sleep(10)  # Wait 10 seconds before next reading
    except KeyboardInterrupt:
        print("\nSimulator stopped.")
