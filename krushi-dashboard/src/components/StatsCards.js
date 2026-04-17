import React from "react";

function Card({ title, value, icon }) {
  return (
    <div style={styles.card}>
      <div style={styles.title}>{icon} {title}</div>
      <div style={styles.value}>{value ?? "--"}</div>
    </div>
  );
}

function StatsCards({ stats }) {
  return (
    <div style={styles.container}>
      <Card title="Soil" value={stats.avg_soil?.toFixed(1)} icon="🌱" />
      <Card title="Temperature" value={stats.avg_temperature?.toFixed(1)} icon="🌡" />
      <Card title="Humidity" value={stats.avg_humidity?.toFixed(1)} icon="💧" />
      <Card title="Irrigations" value={stats.total_irrigations} icon="🚿" />
    </div>
  );
}

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px"
  },
  card: {
    background: "#111827",
    padding: "15px",
    borderRadius: "12px",
    border: "1px solid #1f2937"
  },
  title: {
    color: "#9ca3af",
    fontSize: "13px"
  },
  value: {
    fontSize: "22px",
    fontWeight: "bold",
    marginTop: "5px"
  }
};

export default StatsCards;