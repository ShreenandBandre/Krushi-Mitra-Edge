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
        <div
          style={{
            color: theme.subText,
            fontSize: "13px",
            fontWeight: "600",
            textTransform: "uppercase"
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: theme.text
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function StatsCards({ stats = {}, theme }) {
  const soil = stats?.avg_soil?.toFixed?.(1) ?? "0.0";
  const temp = stats?.avg_temperature?.toFixed?.(1) ?? "0.0";
  const humidity = stats?.avg_humidity?.toFixed?.(1) ?? "0.0";
  const irrigations = stats?.total_irrigations ?? 0;

  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      <Card
        title="Soil"
        value={`${soil}%`}
        icon={Droplet}
        color="#3b82f6"
        theme={theme}
      />

      <Card
        title="Temp"
        value={`${temp}°C`}
        icon={Thermometer}
        color="#f97316"
        theme={theme}
      />

      <Card
        title="Humidity"
        value={`${humidity}%`}
        icon={Wind}
        color="#10b981"
        theme={theme}
      />

      <Card
        title="Irrigation"
        value={irrigations}
        icon={Zap}
        color="#8b5cf6"
        theme={theme}
      />
    </div>
  );
}

export default StatsCards;