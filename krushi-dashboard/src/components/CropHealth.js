import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Sprout } from "lucide-react";

function CropHealth({ latest, theme }) {
  if (!latest) return null;

  const health = Math.min(100, (latest.soil / 50) * 100);
  let status = health > 70 ? "Healthy" : health > 40 ? "Needs Care" : "Critical";
  let statusColor = health > 70 ? "#22c55e" : health > 40 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{
      background: theme.card,
      padding: "25px",
      borderRadius: "20px",
      border: `1px solid ${theme.border}`,
      textAlign: "center"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        <Sprout color={theme.accent} size={20} />
        <h3 style={{ margin: 0, color: theme.text }}>Field Health</h3>
      </div>

      <div style={{ width: "130px", margin: "0 auto 20px auto" }}>
        <CircularProgressbar 
          value={health} 
          text={`${health.toFixed(0)}%`} 
          styles={buildStyles({ 
            pathColor: statusColor, 
            textColor: theme.text, 
            trailColor: theme.darkMode ? "#334155" : "#f1f5f9" 
          })}
        />
      </div>

      <div style={{ 
        display: "inline-block", 
        padding: "6px 20px", 
        borderRadius: "20px", 
        background: `${statusColor}20`, 
        color: statusColor,
        fontWeight: "bold"
      }}>
        {status}
      </div>
    </div>
  );
}

export default CropHealth;