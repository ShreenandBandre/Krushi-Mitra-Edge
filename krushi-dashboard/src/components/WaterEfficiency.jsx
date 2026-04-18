import React from "react";
import { Droplets } from "lucide-react";

export default function WaterEfficiency({ data, theme }) {
  if (!data) return null;
  return (
    <div style={{ background: theme.card, padding: "20px", borderRadius: "20px", border: `1px solid ${theme.border}` }}>
      <h4 style={{ margin: "0 0 12px 0", color: "#3b82f6", display: "flex", alignItems: "center", gap: "8px" }}>
        <Droplets size={18} /> Irrigation Efficiency
      </h4>
      <div style={{ fontSize: "32px", fontWeight: "bold", color: theme.text }}>{data.efficiency?.toFixed(1)}%</div>
      <p style={{ color: theme.subText, fontSize: "14px", marginTop: "8px" }}>{data.suggestion}</p>
    </div>
  );
}
// export default WaterEfficiency;