#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "secret.h"
// --- Configuration ---

// Update with the IP address of your Raspberry Pi running the FastAPI application
String apiUrl = String("http://") + IP_ADDRESS + ":8000/api/predict";

const String cropType = "wheat"; // Configure the crop type for this node

// --- Pin Definitions ---
const int soilMoisturePin = 34; // Analog pin for Soil Moisture Sensor
const int pumpRelayPin = 5;     // Digital output pin for the Water Pump Relay
// If you are using a DHT sensor for Temperature/Humidity, you would define it here
 #include <DHT.h>
 #define DHTPIN 4
 #define DHTTYPE DHT22
 DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  
  // Initialize pump relay
  pinMode(pumpRelayPin, OUTPUT);
  digitalWrite(pumpRelayPin, LOW); // Start with pump OFF
  
  dht.begin(); // Initialize DHT sensor if used

  // Connect to Wi-Fi
  Serial.print("Connecting to Wi-Fi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi!");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // Configure the HTTP request
    http.begin(apiUrl);
    http.addHeader("Content-Type", "application/json");


    // --- Read Sensor Data ---
    // Read soil moisture (ESP32 ADC is 12-bit: 0 to 4095)

    int rawSoil = analogRead(soilMoisturePin);
    
    // Convert to percentage (Note: usually 4095 is completely dry and 0 is water depending on the sensor, 
    // adjust this mapping based on your specific sensor calibration)
    float soilMoisturePercent = map(rawSoil, 4095, 0, 0, 100); 
    
    // Read Temp and Humidity (using dummy values here, replace with actual DHT readings)
     float tempC = dht.readTemperature();
     float humidity = dht.readHumidity();
    // float tempC = 30.5;      
    // float humidity = 65.0;   

    // --- Create JSON Payload ---
    StaticJsonDocument<200> doc;
    doc["soil_moisture"] = soilMoisturePercent;
    doc["temperature"] = tempC;
    doc["air_humidity"] = humidity;
    doc["crop"] = cropType;

    String jsonPayload;
    serializeJson(doc, jsonPayload);

    Serial.println("\n--- Sending Data to Raspberry Pi ---");
    Serial.println("Payload: " + jsonPayload);

    // --- Send POST Request ---
    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("HTTP Status Code: ");
      Serial.println(httpResponseCode);
      Serial.print("Response: ");
      Serial.println(response);
      
      // --- Parse Response ---
      StaticJsonDocument<512> responseDoc;
      DeserializationError error = deserializeJson(responseDoc, response);
      
      if (!error) {
        bool irrigate = responseDoc["irrigate"];
        
        if (irrigate) {
          digitalWrite(pumpRelayPin, HIGH); // Turn ON pump
          Serial.println("Action: Pump turned ON");
        } else {
          digitalWrite(pumpRelayPin, LOW);  // Turn OFF pump
          Serial.println("Action: Pump turned OFF");
        }
      } else {
        Serial.print("deserializeJson() failed: ");
        Serial.println(error.c_str());
      }
    } else {
      Serial.print("Error sending POST Request. Code: ");
      Serial.println(httpResponseCode);
    }
    
    // Free resources
    http.end();
  } else {
    Serial.println("Wi-Fi Disconnected. Waiting for reconnection...");
  }
  
  // Wait before sending the next reading (e.g., 30 seconds)
  delay(5000); 
}
