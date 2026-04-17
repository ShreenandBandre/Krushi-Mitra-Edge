import React from "react";

function WaterEfficiency({ data }) {
  if (!data) return null;

  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      marginTop: "20px"
    }}>
      <h3>💧 Water Efficiency</h3>

      <h2>{data.efficiency?.toFixed(1)}%</h2>
      <p>{data.suggestion}</p>
    </div>
  );
}

export default WaterEfficiency;