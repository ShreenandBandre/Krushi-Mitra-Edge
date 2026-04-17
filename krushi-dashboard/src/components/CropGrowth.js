function CropGrowthTracker({ growth, theme }) {
  if (!growth) return null;

  return (
    <div style={{
      background: theme.card,
      padding: "20px",
      borderRadius: "24px",
      border: `1px solid ${theme.border}`,
      marginBottom: "24px",
      transition: "0.3s"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <div>
          <span style={{ fontSize: "12px", color: theme.subText, fontWeight: "600", textTransform: "uppercase" }}>Current Phase</span>
          <h2 style={{ margin: 0, color: theme.text, fontSize: "20px" }}>{growth.stage}</h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "12px", color: theme.subText, fontWeight: "600" }}>DAY {growth.days} OF 120</span>
          <div style={{ color: theme.accent, fontWeight: "bold" }}>{growth.progress}% Complete</div>
        </div>
      </div>

      {/* Modern Progress Bar */}
      <div style={{ 
        width: "100%", height: "12px", background: theme.darkMode ? "#334155" : "#eef2f6", 
        borderRadius: "10px", overflow: "hidden", position: "relative" 
      }}>
        <div style={{ 
          width: `${growth.progress}%`, height: "100%", background: theme.accent, 
          borderRadius: "10px", transition: "width 1s ease-in-out",
          boxShadow: `0 0 10px ${theme.accent}60`
        }} />
      </div>

      {/* Stage Markers */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "10px", color: theme.subText, fontWeight: "600" }}>
        <span>PLANTING</span>
        <span>VEGETATIVE</span>
        <span>FLOWERING</span>
        <span>HARVEST</span>
      </div>
    </div>
  );
}