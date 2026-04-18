import React from "react";
import { BrainCircuit, Info, Thermometer, Droplets, Zap } from "lucide-react";

function Insights({ insights, theme }) {
  if (!insights || insights.message) return null;

  const itemStyle = {
    background: theme.darkMode ? "#334155" : "#f8fafc",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "14px",
    color: theme.text,
    display: "flex",
    justifyContent: "space-between"
  };

  return (
    <div style={{
      background: theme.card,
      padding: "25px",
      borderRadius: "20px",
      border: `1px solid ${theme.border}`,
      boxShadow: theme.darkMode ? "none" : "0 4px 12px rgba(0,0,0,0.05)",
    }}>
      <h3 style={{ margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "10px", color: theme.text }}>
        <BrainCircuit color={theme.accent} size={24} /> AI Analysis
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
        <div style={itemStyle}><span>Avg Temp</span> <strong>{insights.avg_temp?.toFixed(1)}°</strong></div>
        <div style={itemStyle}><span>Humidity</span> <strong>{insights.avg_humidity?.toFixed(1)}%</strong></div>
        <div style={itemStyle}><span>Stress</span> <strong style={{color: "#ef4444"}}>{insights.stress_level}</strong></div>
        <div style={itemStyle}><span>Soil State</span> <strong>{insights.drying_status}</strong></div>
      </div>

      <div style={{
        background: theme.darkMode ? "rgba(34, 197, 94, 0.1)" : "#f0fdf4",
        padding: "16px",
        borderRadius: "12px",
        borderLeft: `4px solid ${theme.accent}`,
        display: "flex",
        gap: "12px"
      }}>
        <Info color={theme.accent} size={20} style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: "bold", color: theme.accent, fontSize: "14px", textTransform: "uppercase" }}>Advice</div>
          <div style={{ color: theme.text, marginTop: "4px", fontSize: "15px", lineHeight: "1.4" }}>{insights.recommendation}</div>
        </div>
      </div>
    </div>
  );
}

export default Insights;