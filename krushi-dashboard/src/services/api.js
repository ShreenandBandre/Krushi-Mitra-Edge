import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8001",
});

export const getLatest = () => API.get("/api/latest");
export const getHistory = () => API.get("/api/history");
export const getStats = () => API.get("/api/stats");
export const getAnalytics = () => API.get("/api/analytics");
export const getInsights = () => API.get("/api/insights");
export const getWaterEfficiency = () =>
  API.get("/api/water-efficiency");
export const getWeeklySummary = () =>
  API.get("/api/weekly-summary");