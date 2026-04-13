import { useState, useEffect } from "react";

const API = "http://localhost:5000/api";

export default function Leaderboard({ onBack }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => { fetchLeaders(); }, []);

  const fetchLeaders = async () => {
    try {
      const res = await fetch(`${API}/progress/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // Mock leaderboard data with current user
        const mockLeaders = [
          { name: "Priya Sharma", score: 98, completed: 15, avatar: "P" },
          { name: "Rahul Gupta", score: 92, completed: 12, avatar: "R" },
          { name: "Anjali Singh", score: 88, completed: 11, avatar: "A" },
          { name: currentUser.name || "You", score: data.averageScore || 0, completed: data.totalCompleted || 0, avatar: currentUser.name?.[0]?.toUpperCase() || "U", isYou: true },
          { name: "Vikram Patel", score: 75, completed: 8, avatar: "V" },
          { name: "Neha Joshi", score: 70, completed: 7, avatar: "N" },
          { name: "Amit Kumar", score: 65, completed: 6, avatar: "A" },
        ];
        mockLeaders.sort((a, b) => b.score - a.score);
        setLeaders(mockLeaders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const medals = ["🥇", "🥈", "🥉"];

  if (loading) return (
    <div style={styles.loadingPage}>
      <div style={{ fontSize: "4rem" }}>🏆</div>
      <p style={styles.loadingText}>Loading...</p>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <h1 style={styles.title}>🏆 Leaderboard</h1>
        <span style={styles.subtitle}>Top Learners</span>
      </div>

      {/* Top 3 */}
      <div style={styles.topThree}>
        {leaders.slice(0, 3).map((l, i) => (
          <div key={i} style={{ ...styles.topCard, ...(i === 0 ? styles.firstPlace : {}) }}>
            <div style={styles.medal}>{medals[i]}</div>
            <div style={{ ...styles.topAvatar, background: l.isYou ? "linear-gradient(135deg, #6c63ff, #3b82f6)" : "linear-gradient(135deg, #f59e0b, #ef4444)" }}>
              {l.avatar}
            </div>
            <p style={styles.topName}>{l.isYou ? "⭐ " + l.name : l.name}</p>
            <p style={styles.topScore}>{l.score}%</p>
            <p style={styles.topCompleted}>{l.completed} lessons</p>
          </div>
        ))}
      </div>

      {/* Full List */}
      <div style={styles.list}>
        {leaders.map((l, i) => (
          <div key={i} style={{ ...styles.listItem, ...(l.isYou ? styles.youRow : {}) }}>
            <span style={styles.rank}>#{i + 1}</span>
            <div style={{ ...styles.listAvatar, background: l.isYou ? "linear-gradient(135deg, #6c63ff, #3b82f6)" : "rgba(255,255,255,0.1)" }}>
              {l.avatar}
            </div>
            <div style={styles.listInfo}>
              <p style={styles.listName}>{l.isYou ? "⭐ " + l.name + " (You)" : l.name}</p>
              <p style={styles.listSub}>{l.completed} lessons complete</p>
            </div>
            <div style={styles.listScore}>
              <span style={styles.scoreText}>{l.score}%</span>
              <div style={styles.scoreBar}>
                <div style={{ ...styles.scoreBarFill, width: `${l.score}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0f0f1a", padding: "32px", fontFamily: "'Segoe UI', sans-serif" },
  loadingPage: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0f0f1a" },
  loadingText: { color: "#fff", fontSize: "1.2rem", marginTop: "16px" },
  header: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" },
  backBtn: { padding: "10px 20px", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "0.9rem" },
  title: { color: "#fff", fontSize: "1.8rem", fontWeight: "800", margin: 0 },
  subtitle: { color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", marginLeft: "auto" },
  topThree: { display: "flex", justifyContent: "center", gap: "16px", marginBottom: "32px", flexWrap: "wrap" },
  topCard: { background: "rgba(255,255,255,0.04)", borderRadius: "20px", padding: "24px 32px", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center", minWidth: "160px" },
  firstPlace: { background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", transform: "scale(1.05)" },
  medal: { fontSize: "2.5rem", marginBottom: "12px" },
  topAvatar: { width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.5rem", fontWeight: "700", margin: "0 auto 12px" },
  topName: { color: "#fff", fontSize: "0.95rem", fontWeight: "600", marginBottom: "4px" },
  topScore: { color: "#f59e0b", fontSize: "1.3rem", fontWeight: "800", marginBottom: "4px" },
  topCompleted: { color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" },
  list: { maxWidth: "700px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" },
  listItem: { display: "flex", alignItems: "center", gap: "16px", background: "rgba(255,255,255,0.04)", borderRadius: "14px", padding: "16px 20px", border: "1px solid rgba(255,255,255,0.08)" },
  youRow: { background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.3)" },
  rank: { color: "rgba(255,255,255,0.4)", fontSize: "1rem", fontWeight: "700", width: "30px" },
  listAvatar: { width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1rem", fontWeight: "700", flexShrink: 0 },
  listInfo: { flex: 1 },
  listName: { color: "#fff", fontSize: "0.95rem", fontWeight: "600", margin: 0 },
  listSub: { color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", marginTop: "2px" },
  listScore: { textAlign: "right", minWidth: "80px" },
  scoreText: { color: "#fff", fontSize: "1rem", fontWeight: "700" },
  scoreBar: { background: "rgba(255,255,255,0.08)", borderRadius: "4px", height: "6px", marginTop: "6px" },
  scoreBarFill: { background: "linear-gradient(135deg, #6c63ff, #3b82f6)", height: "100%", borderRadius: "4px" },
};