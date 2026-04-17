import React, { useEffect, useState } from "react";
import {
  getLatest,
  getStats,
  getAnalytics,
  getInsights,
  getWaterEfficiency,
  getWeeklySummary
} from "../services/api";

import StatsCards from "./StatsCards";
import Charts from "./Charts";
import Alerts from "./Alerts";
import Insights from "./Insights";
import CropHealth from "./CropHealth";
import WaterEfficiency from "./WaterEfficiency";
import WeeklySummary from "./WeeklySummary";

function Dashboard() {
  const [latest, setLatest] = useState(null);
  const [stats, setStats] = useState({});
  const [analytics, setAnalytics] = useState([]);
  const [insights, setInsights] = useState({});
  const [efficiency, setEfficiency] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [l, s, a, i, e, w] = await Promise.all([
        getLatest(),
        getStats(),
        getAnalytics(),
        getInsights(),
        getWaterEfficiency(),
        getWeeklySummary()
      ]);

      setLatest(l.data);
      setStats(s.data);
      setAnalytics(a.data);
      setInsights(i.data);
      setEfficiency(e.data);
      setWeekly(w.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div style={styles.loader}>
        🌾 Connecting to farm sensors...
      </div>
    );

  return (
    <div style={styles.page}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={{ margin: 0 }}>🌾 Krushi Mitra</h1>
          <p style={styles.subtext}>Live Farm Intelligence Dashboard</p>
        </div>

        <div style={styles.liveBadge}>
          🟢 LIVE
        </div>
      </div>

      {/* KPI CARDS */}
      <StatsCards stats={stats} />

      {/* MAIN GRID */}
      <div style={styles.gridTop}>
        <CropHealth latest={latest} />
        <Insights insights={insights} />
      </div>

      {/* ALERTS */}
      <div style={styles.section}>
        <Alerts insights={insights} />
      </div>

      {/* ANALYTICS GRID */}
      <div style={styles.gridBottom}>
        <WaterEfficiency data={efficiency} />
        <WeeklySummary data={weekly} />
      </div>

      {/* CHARTS */}
      <div style={styles.section}>
        <Charts data={analytics} />
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "20px",
    background: "#0b1220",
    minHeight: "100vh",
    color: "#fff",
    fontFamily: "Arial"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },
  subtext: {
    color: "#aaa",
    marginTop: "5px"
  },
  liveBadge: {
    background: "#1f2937",
    padding: "8px 12px",
    borderRadius: "20px",
    border: "1px solid #22c55e",
    color: "#22c55e"
  },
  gridTop: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginTop: "20px"
  },
  gridBottom: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginTop: "20px"
  },
  section: {
    marginTop: "20px"
  },
  loader: {
    color: "white",
    textAlign: "center",
    marginTop: "100px"
  }
};

export default Dashboard;