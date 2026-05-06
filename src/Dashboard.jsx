import { useState, useEffect } from "react";
import LessonDetail from "./LessonDetail";
import { ISL_LESSONS } from './lessonsData';

const API = "https://sign-bridge-jfwz.onrender.com/api";

export default function Dashboard({ onAdmin, onProfile, onQuiz, onLeaderboard, onDetector, onChat, onAnalytics, onDictionary, onChallenge, onCertificate, darkMode, toggleDarkMode }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [lessons, setLessons] = useState(ISL_LESSONS);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [search, setSearch] = useState("");
  const [filterDiff, setFilterDiff] = useState("all");
  const [selectedLesson, setSelectedLesson] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(savedUser);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [statsRes, lessonsRes, progressRes] = await Promise.all([
        fetch(`${API}/progress/stats`, { headers }),
        fetch(`${API}/lessons`, { headers }),
        fetch(`${API}/progress`, { headers }),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (lessonsRes.ok) {
        const data = await lessonsRes.json();
        if (data && data.length > 0) setLessons(data);
      }
      if (progressRes.ok) setProgress(await progressRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const filteredLessons = lessons.filter((l) => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) || l.category.toLowerCase().includes(search.toLowerCase());
    const matchDiff = filterDiff === "all" || l.difficulty === filterDiff;
    return matchSearch && matchDiff;
  });

  const streak = JSON.parse(localStorage.getItem("SIGN BRIDGE_streak") || "{}").streak || 0;

  const bg = darkMode ? "#0f0f1a" : "#f0f2f5";
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#1a1a2e";
  const subTextColor = darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
  const borderColor = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const sidebarBg = darkMode ? "rgba(255,255,255,0.03)" : "#ffffff";
  const inputBg = darkMode ? "rgba(255,255,255,0.07)" : "#f8f9fa";

  if (loading) return (
    <div style={{ ...styles.loadingPage, background: bg }}>
      <div style={styles.loadingEmoji}>🤟</div>
      <p style={{ ...styles.loadingText, color: textColor }}>Loading...</p>
    </div>
  );

  if (selectedLesson) return (
    <LessonDetail
      lesson={selectedLesson}
      onBack={() => { setSelectedLesson(null); fetchData(); }}
      darkMode={darkMode}
      token={token}
    />
  );

  return (
    <div style={{ ...styles.page, background: bg }}>
      <div style={{ ...styles.sidebar, background: sidebarBg, borderRight: `1px solid ${borderColor}` }}>
        <div style={styles.sidebarLogo}>
          <span>🤟</span>
          <span style={{ ...styles.sidebarLogoText, color: textColor }}>SIGN BRIDGE</span>
        </div>
        <nav style={styles.nav}>
          {[
            { id: "home", icon: "🏠", label: "Home" },
            { id: "lessons", icon: "📚", label: "Lessons" },
            { id: "progress", icon: "📊", label: "Progress" },
            { id: "profile", icon: "👤", label: "Profile" },
          ].map((item) => (
            <button key={item.id}
              style={{ ...styles.navItem, color: activeTab === item.id ? "#fff" : subTextColor, ...(activeTab === item.id ? styles.navActive : {}) }}
              onClick={() => setActiveTab(item.id)}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button style={{ ...styles.toggleBtn, background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", color: textColor }} onClick={toggleDarkMode}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
        <button style={styles.chatBtn} onClick={onChat}>💬 Chat</button>
        <button style={styles.dictBtn} onClick={onDictionary}>📖 Dictionary</button>
        <button style={styles.challengeBtn} onClick={onChallenge}>🔥 Daily Challenge {streak > 0 ? `(${streak})` : ""}</button>
        <button style={styles.detectorBtn} onClick={onDetector}>🤟 Sign Detector</button>
        <button style={styles.quizBtn} onClick={onQuiz}>🧠 Quiz</button>
        <button style={styles.leaderBtn} onClick={onLeaderboard}>🏆 Leaderboard</button>
        <button style={styles.certBtn} onClick={() => onCertificate({ userName: user?.name, lessonTitle: "Sign Language Course", score: stats?.averageScore || 100 })}>🎓 Certificate</button>
        <button style={styles.analyticsBtn} onClick={onAnalytics}>📊 Analytics</button>
        <button style={styles.adminBtn} onClick={onAdmin}>🛠️ Admin Panel</button>
        <button style={styles.profileBtn} onClick={onProfile}>👤 Edit Profile</button>
        <button style={styles.logoutBtn} onClick={handleLogout}>🚪 Logout</button>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={{ ...styles.headerTitle, color: textColor }}>
              {activeTab === "home" && `Namaste, ${user?.name || "User"}! 👋`}
              {activeTab === "lessons" && "📚 Lessons"}
              {activeTab === "progress" && "📊 Progress"}
              {activeTab === "profile" && "👤 Profile"}
            </h1>
            <p style={{ ...styles.headerSub, color: subTextColor }}>Sign Language seekhte raho!</p>
            {activeTab === "home" && (
              <p style={{ fontSize: "0.8rem", color: subTextColor, marginTop: "4px" }}>
                🤟 India ke 1.8 crore hearing impaired logon ke liye ISL sikhane ka free platform
              </p>
            )}
          </div>
          <div style={styles.userAvatar}>{user?.name?.[0]?.toUpperCase() || "U"}</div>
        </div>

        {activeTab === "home" && (
          <div>
            {/* Welcome Banner */}
            <div style={{
              background: darkMode ? "rgba(108,99,255,0.15)" : "rgba(108,99,255,0.08)",
              border: "1px solid rgba(108,99,255,0.3)",
              borderRadius: "16px",
              padding: "20px 24px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "16px"
            }}>
              <div style={{ fontSize: "2.5rem" }}>🤟</div>
              <div>
                <p style={{ color: "#a78bfa", fontWeight: "700", fontSize: "1rem", margin: "0 0 4px" }}>
                  SIGN BRIDGE mein aapka swagat hai!
                </p>
                <p style={{ color: subTextColor, fontSize: "0.85rem", margin: 0 }}>
                  Indian Sign Language (ISL) seekho — videos, quiz, aur daily challenges ke saath. Hearing impaired community ko samjho aur unse connect karo. 🇮🇳
                </p>
              </div>
            </div>

            <div style={styles.statsGrid}>
              {[
                { label: "Total Lessons", value: lessons.length, icon: "📚", color: "#6c63ff" },
                { label: "Completed", value: stats?.totalCompleted || 0, icon: "✅", color: "#10b981" },
                { label: "Attempted", value: stats?.totalAttempted || 0, icon: "🎯", color: "#f59e0b" },
                { label: "Avg Score", value: `${stats?.averageScore || 0}%`, icon: "⭐", color: "#3b82f6" },
              ].map((s, i) => (
                <div key={i} style={{ ...styles.statCard, background: cardBg, border: `1px solid ${borderColor}`, borderTop: `4px solid ${s.color}` }}>
                  <div style={styles.statIcon}>{s.icon}</div>
                  <div style={{ ...styles.statValue, color: textColor }}>{s.value}</div>
                  <div style={{ ...styles.statLabel, color: subTextColor }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Categories Section */}
            <h2 style={{ ...styles.sectionTitle, color: textColor }}>📂 Categories</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px", marginBottom: "32px" }}>
              {[
                { name: "Numbers", icon: "🔢", color: "#6c63ff" },
                { name: "Daily Phrases", icon: "💬", color: "#10b981" },
                { name: "Emotions", icon: "😊", color: "#f59e0b" },
                { name: "Colors", icon: "🎨", color: "#3b82f6" },
                { name: "Family", icon: "👨‍👩‍👧", color: "#ec4899" },
                { name: "Emergency Signs", icon: "🚨", color: "#ef4444" },
              ].map((cat, i) => (
                <div key={i}
                  onClick={() => setActiveTab("lessons")}
                  style={{
                    background: cardBg,
                    border: `1px solid ${borderColor}`,
                    borderTop: `3px solid ${cat.color}`,
                    borderRadius: "12px",
                    padding: "16px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{cat.icon}</div>
                  <div style={{ color: textColor, fontSize: "0.8rem", fontWeight: "600" }}>{cat.name}</div>
                </div>
              ))}
            </div>

            <h2 style={{ ...styles.sectionTitle, color: textColor }}>🆕 Recent Lessons</h2>
            <div style={styles.lessonsGrid}>
              {lessons.slice(0, 3).map((lesson) => (
                <LessonCard key={lesson._id} lesson={lesson} progress={progress} token={token} onUpdate={fetchData}
                  cardBg={cardBg} textColor={textColor} subTextColor={subTextColor} borderColor={borderColor}
                  onStart={() => setSelectedLesson(lesson)}
                  onCertificate={() => onCertificate({ userName: user?.name, lessonTitle: lesson.title, score: 100 })} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "lessons" && (
          <div>
            <div style={styles.searchBar}>
              <input style={{ ...styles.searchInput, background: inputBg, border: `1px solid ${borderColor}`, color: textColor }} placeholder="🔍 Lesson search karo..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <select style={{ ...styles.filterSelect, background: inputBg, border: `1px solid ${borderColor}`, color: textColor }} value={filterDiff} onChange={(e) => setFilterDiff(e.target.value)}>
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div style={styles.lessonsGrid}>
              {filteredLessons.map((lesson) => (
                <LessonCard key={lesson._id} lesson={lesson} progress={progress} token={token} onUpdate={fetchData}
                  cardBg={cardBg} textColor={textColor} subTextColor={subTextColor} borderColor={borderColor}
                  onStart={() => setSelectedLesson(lesson)}
                  onCertificate={() => onCertificate({ userName: user?.name, lessonTitle: lesson.title, score: 100 })} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "progress" && (
          <div>
            <div style={styles.statsGrid}>
              {[
                { label: "Total Attempted", value: stats?.totalAttempted || 0, icon: "🎯", color: "#6c63ff" },
                { label: "Total Completed", value: stats?.totalCompleted || 0, icon: "✅", color: "#10b981" },
                { label: "Average Score", value: `${stats?.averageScore || 0}%`, icon: "⭐", color: "#f59e0b" },
              ].map((s, i) => (
                <div key={i} style={{ ...styles.statCard, background: cardBg, border: `1px solid ${borderColor}`, borderTop: `4px solid ${s.color}` }}>
                  <div style={styles.statIcon}>{s.icon}</div>
                  <div style={{ ...styles.statValue, color: textColor }}>{s.value}</div>
                  <div style={{ ...styles.statLabel, color: subTextColor }}>{s.label}</div>
                </div>
              ))}
            </div>
            <h2 style={{ ...styles.sectionTitle, color: textColor }}>📋 Lesson History</h2>
            {progress.length === 0 ? (
              <div style={{ ...styles.emptyBox, background: cardBg }}>
                <p style={{ ...styles.emptyText, color: subTextColor }}>Abhi koi progress nahi hai</p>
              </div>
            ) : (
              progress.map((p) => (
                <div key={p._id} style={{ ...styles.progressItem, background: cardBg, border: `1px solid ${borderColor}` }}>
                  <div>
                    <p style={{ ...styles.progressTitle, color: textColor }}>{p.lesson?.title || "Lesson"}</p>
                    <p style={{ ...styles.progressSub, color: subTextColor }}>{p.lesson?.category} • {p.attempts} attempts</p>
                  </div>
                  <div style={styles.progressRight}>
                    <span style={{ ...styles.progressBadge, background: p.completed ? "#10b981" : "#f59e0b" }}>
                      {p.completed ? "✅ Complete" : "⏳ Incomplete"}
                    </span>
                    <span style={{ ...styles.progressScore, color: textColor }}>{p.score}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div style={{ ...styles.profileCard, background: cardBg, border: `1px solid ${borderColor}` }}>
            <div style={styles.profileAvatar}>{user?.name?.[0]?.toUpperCase() || "U"}</div>
            <h2 style={{ ...styles.profileName, color: textColor }}>{user?.name}</h2>
            <p style={{ ...styles.profileEmail, color: subTextColor }}>{user?.email}</p>
            <div style={styles.profileStats}>
              {[
                { value: lessons.length, label: "Lessons" },
                { value: stats?.totalCompleted || 0, label: "Completed" },
                { value: `${stats?.averageScore || 0}%`, label: "Avg Score" },
              ].map((s, i) => (
                <div key={i} style={styles.profileStat}>
                  <span style={{ ...styles.profileStatValue, color: textColor }}>{s.value}</span>
                  <span style={{ ...styles.profileStatLabel, color: subTextColor }}>{s.label}</span>
                </div>
              ))}
            </div>
            <button style={styles.certBtnProfile} onClick={() => onCertificate({ userName: user?.name, lessonTitle: "Sign Language Course", score: stats?.averageScore || 100 })}>
              🎓 Certificate Generate Karo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function LessonCard({ lesson, progress, token, onUpdate, cardBg, textColor, subTextColor, borderColor, onCertificate, onStart }) {
  const p = progress.find((p) => p.lesson?._id === lesson._id || p.lesson === lesson._id);
  const diffColors = { Beginner: "#10b981", Intermediate: "#f59e0b", Advanced: "#ef4444", beginner: "#10b981", intermediate: "#f59e0b", advanced: "#ef4444" };

  return (
    <div style={{ ...styles.lessonCard, background: cardBg, border: `1px solid ${borderColor}` }}>
      <div style={styles.lessonHeader}>
        <span style={{ ...styles.diffBadge, background: diffColors[lesson.difficulty] || "#6c63ff" }}>
          {lesson.difficulty}
        </span>
        {p?.completed && <span>✅</span>}
      </div>
      <h3 style={{ ...styles.lessonTitle, color: textColor }}>{lesson.title}</h3>
      <p style={{ ...styles.lessonDesc, color: subTextColor }}>{lesson.description || "Sign language lesson"}</p>
      <div style={styles.lessonFooter}>
        <span style={{ ...styles.lessonCategory, color: subTextColor }}>📂 {lesson.category}</span>
        <div style={{ display: "flex", gap: "8px" }}>
          {!p?.completed && <button style={styles.startBtn} onClick={onStart}>Start →</button>}
          {p?.completed && <button style={styles.certSmallBtn} onClick={onCertificate}>🎓</button>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" },
  loadingPage: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" },
  loadingEmoji: { fontSize: "4rem", marginBottom: "16px" },
  loadingText: { fontSize: "1.2rem" },
  sidebar: { width: "240px", display: "flex", flexDirection: "column", padding: "24px 16px", overflowY: "auto" },
  sidebarLogo: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px", padding: "0 8px" },
  sidebarLogoText: { fontSize: "1.4rem", fontWeight: "900", letterSpacing: "3px" },
  nav: { display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px" },
  navItem: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", border: "none", background: "transparent", cursor: "pointer", borderRadius: "12px", fontSize: "0.95rem", fontWeight: "500", textAlign: "left" },
  navActive: { background: "rgba(108,99,255,0.15)", borderLeft: "3px solid #6c63ff" },
  toggleBtn: { padding: "10px 16px", border: "none", borderRadius: "12px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", marginBottom: "12px", textAlign: "left" },
  chatBtn: { padding: "10px 16px", border: "1px solid rgba(236,72,153,0.4)", background: "rgba(236,72,153,0.15)", color: "#f9a8d4", cursor: "pointer", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px" },
  dictBtn: { padding: "10px 16px", border: "1px solid rgba(251,191,36,0.4)", background: "rgba(251,191,36,0.15)", color: "#fde68a", cursor: "pointer", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px" },
  challengeBtn: { padding: "10px 16px", border: "1px solid rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.15)", color: "#fca5a5", cursor: "pointer", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px" },
  detectorBtn: { padding: "10px 16px", border: "1px solid rgba(168,85,247,0.4)", background: "rgba(168,85,247,0.15)", color: "#d8b4fe", cursor: "pointer", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px" },
  quizBtn: { padding: "10px 16px", border: "1px solid rgba(16,185,129,0.4)", background: "rgba(16,185,129,0.15)", color: "#6ee7b7", cursor: "pointer", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px" },
  leaderBtn: { padding: "10px 16px", border: "1px solid rgba(245,158,11,0.4)", background: "rgba(245,158,11,0.15)", color: "#fcd34d", cursor: "pointer", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px" },
  certBtn: { padding: "10px 16px", border: "1px solid rgba(16,185,129,0.4)", background: "rgba(16,185,129,0.15)", color: "#6ee7b7", cursor: "pointer", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px" },
  analyticsBtn: { padding: "10px 16px", border: "1px solid rgba(59,130,246,0.4)", background: "rgba(59,130,246,0.15)", color: "#93c5fd", cursor: "pointer", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px" },
  adminBtn: { padding: "10px 16px", border: "1px solid rgba(108,99,255,0.4)", background: "rgba(108,99,255,0.15)", color: "#a78bfa", cursor: "pointer", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px" },
  profileBtn: { padding: "10px 16px", border: "1px solid rgba(59,130,246,0.4)", background: "rgba(59,130,246,0.15)", color: "#93c5fd", cursor: "pointer", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px" },
  logoutBtn: { padding: "10px 16px", border: "1px solid rgba(255,80,80,0.2)", background: "transparent", color: "#ff8080", cursor: "pointer", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "600" },
  main: { flex: 1, padding: "32px", overflow: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" },
  headerTitle: { fontSize: "1.8rem", fontWeight: "800", margin: 0 },
  headerSub: { fontSize: "0.9rem", marginTop: "4px" },
  userAvatar: { width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg, #6c63ff, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.2rem", fontWeight: "700" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "32px" },
  statCard: { borderRadius: "16px", padding: "24px" },
  statIcon: { fontSize: "2rem", marginBottom: "12px" },
  statValue: { fontSize: "2rem", fontWeight: "800", marginBottom: "4px" },
  statLabel: { fontSize: "0.85rem" },
  sectionTitle: { fontSize: "1.2rem", fontWeight: "700", marginBottom: "16px" },
  searchBar: { display: "flex", gap: "12px", marginBottom: "24px" },
  searchInput: { flex: 1, padding: "12px 16px", borderRadius: "12px", fontSize: "0.95rem", outline: "none" },
  filterSelect: { padding: "12px 16px", borderRadius: "12px", fontSize: "0.95rem", outline: "none", cursor: "pointer" },
  lessonsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" },
  lessonCard: { borderRadius: "16px", padding: "24px" },
  lessonHeader: { display: "flex", justifyContent: "space-between", marginBottom: "12px" },
  diffBadge: { padding: "4px 12px", borderRadius: "20px", color: "#fff", fontSize: "0.75rem", fontWeight: "600" },
  lessonTitle: { fontSize: "1.1rem", fontWeight: "700", marginBottom: "8px" },
  lessonDesc: { fontSize: "0.85rem", marginBottom: "16px", lineHeight: "1.5" },
  lessonFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  lessonCategory: { fontSize: "0.8rem" },
  startBtn: { padding: "8px 16px", background: "linear-gradient(135deg, #6c63ff, #3b82f6)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" },
  certSmallBtn: { padding: "8px 12px", background: "linear-gradient(135deg, #10b981, #3b82f6)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "0.85rem", cursor: "pointer" },
  emptyBox: { borderRadius: "16px", padding: "48px", textAlign: "center" },
  emptyText: { fontSize: "1.1rem", fontWeight: "600", marginBottom: "8px" },
  progressItem: { display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "12px", padding: "16px 20px", marginBottom: "12px" },
  progressTitle: { fontSize: "1rem", fontWeight: "600", margin: 0 },
  progressSub: { fontSize: "0.8rem", marginTop: "4px" },
  progressRight: { display: "flex", alignItems: "center", gap: "12px" },
  progressBadge: { padding: "4px 12px", borderRadius: "20px", color: "#fff", fontSize: "0.75rem", fontWeight: "600" },
  progressScore: { fontSize: "1.1rem", fontWeight: "700" },
  profileCard: { borderRadius: "24px", padding: "48px", textAlign: "center", maxWidth: "500px", margin: "0 auto" },
  profileAvatar: { width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #6c63ff, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "2rem", fontWeight: "700", margin: "0 auto 16px" },
  profileName: { fontSize: "1.5rem", fontWeight: "800", marginBottom: "8px" },
  profileEmail: { fontSize: "0.95rem", marginBottom: "32px" },
  profileStats: { display: "flex", justifyContent: "center", gap: "32px", marginBottom: "24px" },
  profileStat: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" },
  profileStatValue: { fontSize: "1.5rem", fontWeight: "800" },
  profileStatLabel: { fontSize: "0.8rem" },
  certBtnProfile: { width: "100%", padding: "14px", background: "linear-gradient(135deg, #10b981, #3b82f6)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "1rem", fontWeight: "700", cursor: "pointer" },
};