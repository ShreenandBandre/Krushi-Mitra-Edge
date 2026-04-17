function Insights({ insights }) {
  if (!insights || insights.message) return null;

  return (
    <div style={styles.box}>
      <h3>🧠 AI Insights</h3>

      <p>🌡 Temp: {insights.avg_temp?.toFixed(1)}</p>
      <p>💧 Humidity: {insights.avg_humidity?.toFixed(1)}</p>
      <p>🔥 Stress: {insights.stress_level}</p>
      <p>🌱 Drying: {insights.drying_status}</p>

      <div style={styles.reco}>
        👉 {insights.recommendation}
      </div>
    </div>
  );
}

const styles = {
  box: {
    background: "#111827",
    padding: "15px",
    borderRadius: "12px"
  },
  reco: {
    marginTop: "10px",
    padding: "10px",
    background: "#0b1220",
    borderRadius: "8px",
    border: "1px solid #1f2937"
  }
};

export default Insights;