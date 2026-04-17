import React from "react";
import { Calendar } from "lucide-react";

export default function WeeklySummary({ data, theme }) {
  if (!data || data.message) return null;
  return (
    <div style={{ background: theme.card, padding: "20px", borderRadius: "20px", border: `1px solid ${theme.border}` }}>
      <h4 style={{ margin: "0 0 12px 0", color: theme.accent, display: "flex", alignItems: "center", gap: "8px" }}>
        <Calendar size={18} /> Weekly Overview
      </h4>
      <div style={{ color: theme.text, fontSize: "14px" }}>
        <p style={{ marginBottom: "10px" }}><strong>Trend:</strong> {data.trend}</p>
        <div style={{ background: theme.darkMode ? "#064e3b" : "#f0fdf4", padding: "12px", borderRadius: "10px", color: theme.accent }}>
          {data.summary}
        </div>
      </div>
    </div>
  );
}
// export default WeeklySummary;