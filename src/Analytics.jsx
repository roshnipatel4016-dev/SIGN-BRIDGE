import { useState, useEffect } from "react";

const API = "http://localhost:5000/api";

export default function Analytics({ onBack }) {
  const [users, setUsers] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [lessonsRes, progressRes] = await Promise.all([
        fetch(`${API}/lessons`, { headers }),
        fetch(`${API}/progress`, { headers }),
      ]);
      if (lessonsRes.ok) setLessons(await lessonsRes.json());
      if (progressRes.ok) {
        const p = await progressRes.json();
        setProgress(p);
      }
      // Mock users data
      setUsers([
        { name: "Roshni Patel", email: "roshnipatel4016@gmail.com", role: "admin", joinedAt: "2026-03-06", lastLogin: "Today" },
        { name: "Test User", email: "test@gmail.com", role: "user", joinedAt: "2026-03-07", lastLogin: "Today" },
      ]);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const totalCompleted = progress.filter(p => p.completed).length;
  const totalAttempted = progress.length;

  if (loading) return (
    <div style={styles.loadingPage}>
      <div style={{ fontSize: "3rem" }}>📊</div>
      <p style={styles.loadingText}>Loading Analytics...</p>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <h1 style={styles.title}>📊 Analytics Dashboard</h1>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {[
          { label: "Total Users", value: users.length, icon: "👥", color: "#6c63ff" },
          { label: "Total Lessons", value: lessons.length, icon: "📚", color: "#3b82f6" },
          { label: "Total Attempts", value: totalAttempted, icon: "🎯", color: "#f59e0b" },
          { label: "Total Completed", value: totalCompleted, icon: "✅", color: "#10b981" },
        ].map((s, i) => (
          <div key={i} style={{ ...styles.statCard, borderTop: `4px solid ${s.color}` }}>
            <div style={styles.statIcon}>{s.icon}</div>
            <div style={styles.statValue}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={styles.grid}>
        {/* Users Table */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>👥 Registered Users</h2>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span style={styles.th}>Name</span>
              <span style={styles.th}>Email</span>
              <span style={styles.th}>Role</span>
              <span style={styles.th}>Joined</span>
              <span style={styles.th}>Last Login</span>
            </div>
            {users.map((u, i) => (
              <div key={i} style={styles.tableRow}>
                <span style={styles.td}>
                  <div style={styles.userAvatar}>{u.name[0]}</div>
                  {u.name}
                </span>
                <span style={styles.td}>{u.email}</span>
                <span style={styles.td}>
                  <span style={{ ...styles.roleBadge, background: u.role === "admin" ? "rgba(108,99,255,0.3)" : "rgba(16,185,129,0.2)" }}>
                    {u.role}
                  </span>
                </span>
                <span style={styles.td}>{u.joinedAt}</span>
                <span style={styles.td}>{u.lastLogin}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lesson Stats */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📚 Lesson Performance</h2>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span style={styles.th}>Lesson</span>
              <span style={styles.th}>Category</span>
              <span style={styles.th}>Attempts</span>
              <span style={styles.th}>Completed</span>
            </div>
            {lessons.slice(0, 10).map((l, i) => {
              const lessonProgress = progress.filter(p => p.lesson?._id === l._id || p.lesson === l._id);
              const completed = lessonProgress.filter(p => p.completed).length;
              return (
                <div key={i} style={styles.tableRow}>
                  <span style={styles.td}>{l.title}</span>
                  <span style={styles.td}>{l.category}</span>
                  <span style={styles.td}>{lessonProgress.length}</span>
                  <span style={styles.td}>
                    <span style={{ ...styles.roleBadge, background: completed > 0 ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)" }}>
                      {completed}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Activity */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>📋 Recent Activity</h2>
        {progress.length === 0 ? (
          <p style={styles.emptyText}>Koi activity nahi hai abhi</p>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span style={styles.th}>Lesson</span>
              <span style={styles.th}>Score</span>
              <span style={styles.th}>Attempts</span>
              <span style={styles.th}>Status</span>
            </div>
            {progress.map((p, i) => (
              <div key={i} style={styles.tableRow}>
                <span style={styles.td}>{p.lesson?.title || "Unknown"}</span>
                <span style={styles.td}>{p.score}%</span>
                <span style={styles.td}>{p.attempts}</span>
                <span style={styles.td}>
                  <span style={{ ...styles.roleBadge, background: p.completed ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)" }}>
                    {p.completed ? "✅ Complete" : "⏳ Incomplete"}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
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
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" },
  statCard: { background: "rgba(255,255,255,0.04)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(255,255,255,0.08)" },
  statIcon: { fontSize: "2rem", marginBottom: "12px" },
  statValue: { color: "#fff", fontSize: "2rem", fontWeight: "800", marginBottom: "4px" },
  statLabel: { color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" },
  card: { background: "rgba(255,255,255,0.04)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "24px" },
  cardTitle: { color: "#fff", fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px" },
  table: { overflowX: "auto" },
  tableHeader: { display: "flex", gap: "8px", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "8px" },
  th: { color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", fontWeight: "600", flex: 1, textTransform: "uppercase" },
  tableRow: { display: "flex", gap: "8px", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center" },
  td: { color: "#fff", fontSize: "0.85rem", flex: 1, display: "flex", alignItems: "center", gap: "8px" },
  userAvatar: { width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #6c63ff, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.8rem", fontWeight: "700", flexShrink: 0 },
  roleBadge: { padding: "3px 10px", borderRadius: "20px", color: "#fff", fontSize: "0.75rem", fontWeight: "600" },
  emptyText: { color: "rgba(255,255,255,0.4)", fontSize: "0.95rem", textAlign: "center", padding: "24px" },
};