import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { TrendingUp } from "lucide-react";

function Charts({ data, theme }) {
  // Fallback for missing data
  if (!data || data.length === 0) {
    return (
      <div style={{ 
        background: theme.card, 
        padding: "40px", 
        borderRadius: "20px", 
        textAlign: "center", 
        marginTop: "20px",
        border: `1px solid ${theme.border}` 
      }}>
        <p style={{ color: theme.subText }}>📊 Waiting for sensor trend data...</p>
      </div>
    );
  }

  return (
    <div style={{
      marginTop: "25px",
      background: theme.card,
      padding: "25px",
      borderRadius: "20px",
      boxShadow: theme.darkMode ? "none" : "0 4px 12px rgba(0,0,0,0.05)",
      border: `1px solid ${theme.border}`,
      transition: "0.3s"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <TrendingUp color={theme.accent} size={24} />
          <h3 style={{ margin: 0, color: theme.text }}>Environmental Trends</h3>
        </div>
        <div style={{ fontSize: "12px", color: theme.subText, fontWeight: "500" }}>LAST 24 HOURS</div>
      </div>

      <div style={{ width: "100%", height: "350px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {/* Soil Gradient (Blue) */}
              <linearGradient id="colorSoil" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              {/* Temp Gradient (Orange) */}
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
              {/* Humidity Gradient (Green) */}
              <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.border} />
            
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: theme.subText, fontSize: 12}} 
              minTickGap={30}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: theme.subText, fontSize: 12}} 
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme.card, 
                borderColor: theme.border, 
                borderRadius: '12px',
                color: theme.text,
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)'
              }} 
              itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
            />

            <Legend verticalAlign="top" height={36} iconType="circle" />

            {/* 1. Soil Moisture Line */}
            <Area 
              name="Soil Moisture (%)"
              type="monotone" 
              dataKey="soil" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSoil)" 
              activeDot={{ r: 6 }}
            />

            {/* 2. Temperature Line */}
            <Area 
              name="Temperature (°C)"
              type="monotone" 
              dataKey="temp" 
              stroke="#f97316" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorTemp)" 
            />

            {/* 3. Humidity Line */}
            <Area 
              name="Humidity (%)"
              type="monotone" 
              dataKey="humidity" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorHum)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Charts;