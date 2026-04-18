const BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function request(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  return res.json();
}

export const getLatest = () => request("/api/latest");
export const getHistory = () => request("/api/history");
export const getStats = () => request("/api/stats");
export const getAnalytics = () => request("/api/analytics");
export const getInsights = () => request("/api/insights");
export const getWaterEfficiency = () => request("/api/water-efficiency");
export const getWeeklySummary = () => request("/api/weekly-summary");
export const getCropGrowth = () => request("/api/crop-growth");