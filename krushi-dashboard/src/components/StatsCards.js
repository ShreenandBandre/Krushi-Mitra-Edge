import React from "react";
import { Droplet, Thermometer, Wind, Zap } from "lucide-react";

function Card({ title, value, icon: Icon, color, theme }) {
  const cardStyle = {
    flex: 1,
    minWidth: "200px",
    background: theme.card,
    padding: "20px",
    borderRadius: "15px",
    boxShadow: theme.darkMode ? "none" : "0 4px 6px rgba(0,0,0,0.05)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    borderLeft: `5px solid ${color}`,
    borderTop: theme.darkMode ? `1px solid ${theme.border}` : "none",
    transition: "0.3s ease"
  };

  return (
    <div style={cardStyle}>
      <div style={{ background: `${color}15`, padding: "12px", borderRadius: "12px" }}>
        <Icon color={color} size={28} />
      </div>
      <div>
        <div style={{ color: theme.subText, fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>
          {title}
        </div>
        <div style={{ fontSize: "24px", fontWeight: "bold", color: theme.text }}>
          {value ?? "--"}
        </div>
      </div>
    </div>
  );
}

function StatsCards({ stats, theme }) {
  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      <Card title="Soil" value={`${stats.avg_soil?.toFixed(1)}%`} icon={Droplet} color="#3b82f6" theme={theme} />
      <Card title="Temp" value={`${stats.avg_temperature?.toFixed(1)}°C`} icon={Thermometer} color="#f97316" theme={theme} />
      <Card title="Humidity" value={`${stats.avg_humidity?.toFixed(1)}%`} icon={Wind} color="#10b981" theme={theme} />
      <Card title="Irrigation" value={stats.total_irrigations} icon={Zap} color="#8b5cf6" theme={theme} />
    </div>
  );
}

export default StatsCards;