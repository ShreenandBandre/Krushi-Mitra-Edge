import React, { useEffect, useState } from "react";
import { 
  getLatest, getStats, getAnalytics, getInsights, 
  getWaterEfficiency, getWeeklySummary, getCropGrowth // Added new service
} from "../services/api";
import { 
  LayoutDashboard, Droplets, Thermometer, Wind, 
  AlertTriangle, Activity, Sun, Moon, Leaf, Zap 
} from "lucide-react";

// Sub-component Imports
import StatsCards from "./StatsCards";
import Charts from "./Charts";
import Alerts from "./Alerts";
import Insights from "./Insights";
import CropHealth from "./CropHealth";
import WaterEfficiency from "./WaterEfficiency";
import WeeklySummary from "./WeeklySummary";

// Internal Component for the Growth Tracker
const CropGrowthTracker = ({ growth, theme }) => {
  if (!growth) return null;
  return (
    <div style={{
      background: theme.card,
      padding: "25px",
      borderRadius: "20px",
      border: `1px solid ${theme.border}`,
      marginBottom: "20px",
      boxShadow: theme.darkMode ? "none" : "0 4px 12px rgba(0,0,0,0.05)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "15px" }}>
        <div>
          <span style={{ fontSize: "12px", color: theme.subText, fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
            Current Growth Phase
          </span>
          <h2 style={{ margin: "5px 0 0 0", color: theme.text, fontSize: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
            {growth.stage}
          </h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "14px", color: theme.text, fontWeight: "bold" }}>Day {growth.days}</span>
          <span style={{ fontSize: "14px", color: theme.subText }}> / 120</span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div style={{ width: "100%", height: "12px", background: theme.darkMode ? "#334155" : "#f1f5f9", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ 
          width: `${growth.progress}%`, 
          height: "100%", 
          background: `linear-gradient(90deg, ${theme.accent}, #4ade80)`, 
          borderRadius: "10px",
          transition: "width 1.5s ease-in-out" 
        }} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "11px", color: theme.subText, fontWeight: "600" }}>
        <span>PLANTING</span>
        <span style={{ color: growth.days >= 15 ? theme.accent : theme.subText }}>VEGETATIVE</span>
        <span style={{ color: growth.days >= 50 ? theme.accent : theme.subText }}>FLOWERING</span>
        <span>HARVEST</span>
      </div>
    </div>
  );
};

function Dashboard() {
  const [data, setData] = useState({ 
    latest: null, stats: {}, analytics: [], 
    insights: {}, efficiency: null, weekly: null 
  });
  const [growth, setGrowth] = useState(null); // New state for growth tracker
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const theme = {
    darkMode,
    bg: darkMode ? "#0f172a" : "#f0f4f8",
    card: darkMode ? "#1e293b" : "#ffffff",
    text: darkMode ? "#f1f5f9" : "#1a3a3a",
    subText: darkMode ? "#94a3b8" : "#64748b",
    border: darkMode ? "#334155" : "#eef2f6",
    accent: "#22c55e",
    headerBg: darkMode ? "#1e293b" : "#ffffff",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Included getCropGrowth in the parallel fetch
        const [l, s, a, i, e, w, g] = await Promise.all([
          getLatest(), getStats(), getAnalytics(), 
          getInsights(), getWaterEfficiency(), getWeeklySummary(),
          getCropGrowth() 
        ]);
        
        setData({ 
          latest: l.data, stats: s.data, analytics: a.data, 
          insights: i.data, efficiency: e.data, weekly: w.data 
        });
        setGrowth(g.data); // Set the growth data
        setLoading(false);
      } catch (err) { 
        console.error("Dashboard Fetch Error:", err); 
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', height: '100vh', background: theme.bg 
    }}>
      <Activity className="animate-spin" color={theme.accent} size={48} />
      <h2 style={{ marginTop: "20px", color: theme.text }}>Syncing Field Data...</h2>
    </div>
  );

  return (
    <div style={{ padding: "30px", background: theme.bg, minHeight: "100vh", transition: "0.3s" }}>
      {/* Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ color: theme.text, margin: 0, display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ background: theme.accent, padding: "8px", borderRadius: "12px", display: "flex", alignItems: "center" }}>
            <Leaf color="white" size={28} />
          </div>
          Krushi Mitra 
          <span style={{ fontSize: '11px', background: darkMode ? '#064e3b' : '#e8f5e9', color: theme.accent, padding: '4px 12px', borderRadius: '20px', marginLeft: '10px' }}>
            LIVE SENSORS
          </span>
        </h1>

        <button onClick={() => setDarkMode(!darkMode)} style={{ background: theme.card, border: `1px solid ${theme.border}`, padding: "10px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
          {darkMode ? <Sun color="#fbbf24" size={20} /> : <Moon color="#64748b" size={20} />}
        </button>
      </div>

      {/* 1. New Growth Tracker (Full Width) */}
      <CropGrowthTracker growth={growth} theme={theme} />

      {/* 2. Stats Summary */}
      <StatsCards stats={data.stats} theme={theme} />

      {/* 3. Real-time Analysis Section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginTop: "20px" }}>
        <CropHealth latest={data.latest} theme={theme} />
        <Insights insights={data.insights} theme={theme} />
      </div>

      {/* 4. Critical Notifications */}
      <Alerts insights={data.insights} theme={theme} />

      {/* 5. Resource Management Section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "20px", marginTop: "20px" }}>
        <WaterEfficiency data={data.efficiency} theme={theme} />
        <WeeklySummary data={data.weekly} theme={theme} />
      </div>

      {/* 6. Trend Analytics */}
      <Charts data={data.analytics} theme={theme} />
      
      <footer style={{ marginTop: "40px", textAlign: "center", color: theme.subText, fontSize: "12px" }}>
        © 2026 Krushi Mitra Smart Systems • Chhatrapati Sambhajinagar
      </footer>
    </div>
  );
}

export default Dashboard;