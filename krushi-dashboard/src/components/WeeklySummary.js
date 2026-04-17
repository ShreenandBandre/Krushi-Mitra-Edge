import React from "react";

function WeeklySummary({ data }) {
  if (!data || data.message) return null;

  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      marginTop: "20px"
    }}>
      <h3>📅 Weekly Summary</h3>

      <p>🌱 Avg Health: {data.avg_health?.toFixed(1)}</p>
      <p>🚿 Irrigations: {data.total_irrigations}</p>
      <p>📈 Trend: {data.trend}</p>

      <h4>{data.summary}</h4>
    </div>
  );
}

export default WeeklySummary;