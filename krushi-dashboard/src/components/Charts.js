import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

function Charts({ data }) {
  return (
    <div style={{
      marginTop: "20px",
      background: "white",
      padding: "20px",
      borderRadius: "12px"
    }}>
      <h3>📊 Sensor Trends</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
  <XAxis dataKey="time" stroke="#9ca3af" />
  <YAxis stroke="#9ca3af" />
  <Tooltip />
  <Line type="monotone" dataKey="soil" stroke="#22c55e" />
  <Line type="monotone" dataKey="temp" stroke="#f59e0b" />
  <Line type="monotone" dataKey="humidity" stroke="#3b82f6" />
</LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Charts;