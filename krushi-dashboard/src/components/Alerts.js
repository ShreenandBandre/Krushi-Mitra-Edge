import React from "react";

function Alerts({ insights }) {
  if (!insights) return null;

  const alerts = [];

  if (insights.stress_level === "HIGH") {
    alerts.push({
      level: "HIGH",
      message: "🔥 Heat stress detected — irrigate immediately"
    });
  }

  if (insights.drying_status === "FAST DRYING") {
    alerts.push({
      level: "MEDIUM",
      message: "🌱 Soil drying too fast"
    });
  }

  if (insights.water_estimate_liters > 100) {
    alerts.push({
      level: "MEDIUM",
      message: "💧 High water usage detected"
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      level: "LOW",
      message: "✅ All systems stable"
    });
  }

  return (
    <div style={styles.box}>
      <h3>🚨 Smart Alerts</h3>

      {alerts.map((a, i) => (
        <div key={i} style={{ ...styles.alert, borderLeftColor: color(a.level) }}>
          {a.message}
        </div>
      ))}
    </div>
  );
}

const color = (l) =>
  l === "HIGH" ? "#ef4444" : l === "MEDIUM" ? "#f59e0b" : "#22c55e";

const styles = {
  box: {
    background: "#111827",
    padding: "15px",
    borderRadius: "12px",
    border: "1px solid #1f2937"
  },
  alert: {
    padding: "10px",
    marginTop: "10px",
    borderLeft: "4px solid",
    background: "#0b1220",
    borderRadius: "6px"
  }
};

export default Alerts;