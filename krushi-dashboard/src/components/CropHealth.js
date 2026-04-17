import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function CropHealth({ latest }) {
  if (!latest) return null;

  const ideal = 50;
  const health = Math.min(100, (latest.soil / ideal) * 100);

  let status = "Good";
  if (health < 40) status = "Critical";
  else if (health < 70) status = "Moderate";

  return (
    <div style={{
      flex: 1,
      background: "white",
      padding: "20px",
      borderRadius: "12px"
    }}>
      <h3>🌿 Crop Health</h3>

      <div style={{ width: "150px", margin: "auto" }}>
        <CircularProgressbar value={health} text={`${health.toFixed(0)}%`} />
      </div>

      <h3 style={{ textAlign: "center" }}>{status}</h3>
    </div>
  );
}



export default CropHealth;