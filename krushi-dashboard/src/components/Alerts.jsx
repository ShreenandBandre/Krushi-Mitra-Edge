import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";

const getAlertConfig = (level) => {
  switch (level) {
    case "HIGH": return { color: "#ef4444", icon: <AlertCircle size={20} /> };
    case "MEDIUM": return { color: "#f59e0b", icon: <AlertTriangle size={20} /> };
    default: return { color: "#22c55e", icon: <CheckCircle size={20} /> };
  }
};

function Alerts({ insights, theme }) {
  if (!insights || !insights.alerts) return null;

  return (
    <div style={{ marginTop: "25px" }}>
      <h3 style={{ color: theme.text, marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px", fontSize: "18px" }}>
        <AlertCircle size={20} color={theme.accent} /> Live Notifications
      </h3>

      {insights.alerts.map((alert, index) => {
        const config = getAlertConfig(alert.level);
        return (
          <div
            key={index}
            style={{
              background: theme.darkMode ? "#1e293b" : "white",
              color: theme.text,
              borderLeft: `5px solid ${config.color}`,
              borderTop: `1px solid ${theme.border}`,
              borderRight: `1px solid ${theme.border}`,
              borderBottom: `1px solid ${theme.border}`,
              padding: "16px 20px",
              borderRadius: "12px",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontWeight: "500",
              boxShadow: theme.darkMode ? "none" : "0 2px 4px rgba(0,0,0,0.02)"
            }}
          >
            <span style={{ color: config.color }}>{config.icon}</span>
            {alert.message}
          </div>
        );
      })}
    </div>
  );
}

export default Alerts;