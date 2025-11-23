import requests
import random
import time
from datetime import datetime, timedelta

API_URL = "https://4f01rfgu43.execute-api.us-east-1.amazonaws.com/prod/telemetry"

history = []  # stores last 20 readings

def generate_sensor_data():
    temp = round(random.uniform(90, 135), 2)
    pres = round(random.uniform(40, 85), 2)
    vib = round(random.uniform(0.2, 3.1), 2)
    cycles = random.randint(10000, 25000)
    status = "Running" if temp < 130 and pres < 80 else "Error"

    return {
        "temperature": temp,
        "pressure": pres,
        "vibration": vib,
        "cycleCount": cycles,
        "status": status
    }

def generate_alerts(data):
    alerts = []

    if data["temperature"] > 120:
        alerts.append({
            "type": "Temperature High",
            "message": f"Temperature reached {data['temperature']}°C",
            "timestamp": datetime.now().strftime("%H:%M:%S")
        })

    if data["pressure"] > 70:
        alerts.append({
            "type": "Pressure High",
            "message": f"Pressure reached {data['pressure']} bar",
            "timestamp": datetime.now().strftime("%H:%M:%S")
        })

    if data["vibration"] > 2.5:
        alerts.append({
            "type": "Vibration Spike",
            "message": f"Unusual vibration detected ({data['vibration']} g)",
            "timestamp": datetime.now().strftime("%H:%M:%S")
        })

    return alerts

def predictive_ai(data):
    """Simulates failure probability based on sensor values"""
    score = 0

    score += (data["temperature"] - 90) * 0.7
    score += (data["pressure"] - 40) * 0.6
    score += (data["vibration"] - 0.2) * 10
    score += (data["cycleCount"] - 10000) / 500

    score = max(0, min(100, round(score, 2)))  # clamp 0–100

    if score < 30:
        risk = "Low"
    elif score < 65:
        risk = "Moderate"
    else:
        risk = "High"

    days_until_maintenance = max(1, 30 - int(score / 3))
    maintenance_date = (datetime.now() + timedelta(days=days_until_maintenance)).strftime("%Y-%m-%d")

    return {
        "failureProbability": score,
        "riskLevel": risk,
        "maintenanceDate": maintenance_date
    }

while True:
    reading = generate_sensor_data()
    alerts = generate_alerts(reading)
    prediction = predictive_ai(reading)

    reading["timestamp"] = datetime.now().strftime("%H:%M:%S")
    reading["alerts"] = alerts
    reading["prediction"] = prediction

    # Update history (keep latest 20 readings)
    history.append({
        "timestamp": reading["timestamp"],
        "temperature": reading["temperature"],
        "pressure": reading["pressure"],
        "vibration": reading["vibration"]
    })
    history[:] = history[-20:]
    reading["history"] = history

    print("\nSending:", reading)

    try:
        response = requests.post(API_URL, json=reading)
        print("Response:", response.status_code, response.text)
    except Exception as e:
        print("❌ Error:", e)

    time.sleep(3)  # send every 3 sec
