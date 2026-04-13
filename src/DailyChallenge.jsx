import { useState, useEffect } from "react";

const challenges = [
  { id: 1, title: "A se Z tak", description: "Aaj A se Z tak sabhi alphabets ka sign karo", points: 100, type: "alphabets" },
  { id: 2, title: "1 se 10 tak", description: "Aaj 1 se 10 tak sabhi numbers ka sign karo", points: 50, type: "numbers" },
  { id: 3, title: "Hello karo", description: "Aaj 5 baar Hello ka sign practice karo", points: 30, type: "greeting" },
  { id: 4, title: "Family signs", description: "Father, Mother, Brother, Sister ke signs seekho", points: 80, type: "family" },
  { id: 5, title: "Colors seekho", description: "Red, Blue, Green, Yellow ke signs seekho", points: 60, type: "colors" },
  { id: 6, title: "I Love You", description: "ILY sign 10 baar practice karo", points: 40, type: "emotion" },
  { id: 7, title: "Quiz Champion", description: "Aaj quiz mein 80% se zyada score karo", points: 120, type: "quiz" },
];

export default function DailyChallenge({ onBack }) {
  const [streak, setStreak] = useState(0);
  const [completedToday, setCompletedToday] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [todayChallenge, setTodayChallenge] = useState(null);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("sign3_streak") || "{}");
    setStreak(saved.streak || 0);
    setTotalPoints(saved.totalPoints || 0);
    setCompletedToday(saved.completedToday || []);
    const today = new Date().getDay();
    setTodayChallenge(challenges[today % challenges.length]);
  }, []);

  const completeChallenge = (challenge) => {
    if (completedToday.includes(challenge.id)) return;
    const newCompleted = [...completedToday, challenge.id];
    const newPoints = totalPoints + challenge.points;
    const newStreak = streak + 1;
    setCompletedToday(newCompleted);
    setTotalPoints(newPoints);
    setStreak(newStreak);
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 2000);
    localStorage.setItem("sign3_streak", JSON.stringify({
      streak: newStreak,
      totalPoints: newPoints,
      completedToday: newCompleted,
      lastDate: new Date().toDateString(),
    }));
  };

  const resetStreak = () => {
    localStorage.removeItem("sign3_streak");
    setStreak(0);
    setTotalPoints(0);
    setCompletedToday([]);
  };

  const streakEmoji = streak >= 30 ? "🔥🔥🔥" : streak >= 14 ? "🔥🔥" : streak >= 7 ? "🔥" : "⭐";

  return (
    <div style={styles.page}>
      {celebrating && (
        <div style={styles.celebration}>
          🎉 Shabash! Challenge Complete! 🎉
        </div>
      )}

      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <h1 style={styles.title}>🔥 Daily Challenge</h1>
      </div>

      {/* Streak Card */}
      <div style={styles.streakCard}>
        <div style={styles.streakLeft}>
          <div style={styles.streakEmoji}>{streakEmoji}</div>
          <div>
            <h2 style={styles.streakNumber}>{streak} Days</h2>
            <p style={styles.streakLabel}>Current Streak</p>
          </div>
        </div>
        <div style={styles.streakRight}>
          <div style={styles.pointsBox}>
            <span style={styles.pointsValue}>⭐ {totalPoints}</span>
            <span style={styles.pointsLabel}>Total Points</span>
          </div>
          <div style={styles.pointsBox}>
            <span style={styles.pointsValue}>✅ {completedToday.length}</span>
            <span style={styles.pointsLabel}>Today Done</span>
          </div>
        </div>
      </div>

      {/* Streak Milestones */}
      <div style={styles.milestonesCard}>
        <h3 style={styles.milestonesTitle}>🏆 Milestones</h3>
        <div style={styles.milestones}>
          {[
            { days: 3, label: "3 Days", emoji: "⭐", done: streak >= 3 },
            { days: 7, label: "1 Week", emoji: "🌟", done: streak >= 7 },
            { days: 14, label: "2 Weeks", emoji: "🔥", done: streak >= 14 },
            { days: 30, label: "1 Month", emoji: "🏆", done: streak >= 30 },
            { days: 100, label: "100 Days", emoji: "👑", done: streak >= 100 },
          ].map((m, i) => (
            <div key={i} style={{ ...styles.milestone, ...(m.done ? styles.milestoneDone : {}) }}>
              <div style={styles.milestoneEmoji}>{m.emoji}</div>
              <div style={styles.milestoneDays}>{m.label}</div>
              {m.done && <div style={styles.milestoneTick}>✅</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Today's Special Challenge */}
      {todayChallenge && (
        <div style={styles.todayCard}>
          <div style={styles.todayBadge}>⚡ Aaj Ka Special Challenge</div>
          <h3 style={styles.todayTitle}>{todayChallenge.title}</h3>
          <p style={styles.todayDesc}>{todayChallenge.description}</p>
          <div style={styles.todayFooter}>
            <span style={styles.todayPoints}>+{todayChallenge.points} Points</span>
            <button
              style={{ ...styles.doneBtn, ...(completedToday.includes(todayChallenge.id) ? styles.doneBtnDone : {}) }}
              onClick={() => completeChallenge(todayChallenge)}>
              {completedToday.includes(todayChallenge.id) ? "✅ Complete!" : "Mark as Done ✓"}
            </button>
          </div>
        </div>
      )}

      {/* All Challenges */}
      <h2 style={styles.sectionTitle}>📋 Sabhi Challenges</h2>
      <div style={styles.challengesGrid}>
        {challenges.map((c) => (
          <div key={c.id} style={{ ...styles.challengeCard, ...(completedToday.includes(c.id) ? styles.challengeDone : {}) }}>
            <div style={styles.challengeHeader}>
              <span style={styles.challengeType}>{c.type}</span>
              <span style={styles.challengePoints}>+{c.points} ⭐</span>
            </div>
            <h3 style={styles.challengeTitle}>{c.title}</h3>
            <p style={styles.challengeDesc}>{c.description}</p>
            <button
              style={{ ...styles.completeBtn, ...(completedToday.includes(c.id) ? styles.completeBtnDone : {}) }}
              onClick={() => completeChallenge(c)}>
              {completedToday.includes(c.id) ? "✅ Done!" : "Complete Karo →"}
            </button>
          </div>
        ))}
      </div>

      <button style={styles.resetBtn} onClick={resetStreak}>🔄 Reset Streak</button>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0f0f1a", padding: "32px", fontFamily: "'Segoe UI', sans-serif", position: "relative" },
  celebration: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "linear-gradient(135deg, #6c63ff, #3b82f6)", color: "#fff", fontSize: "1.5rem", fontWeight: "800", padding: "24px 48px", borderRadius: "20px", zIndex: 1000, textAlign: "center", boxShadow: "0 20px 60px rgba(108,99,255,0.5)" },
  header: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" },
  backBtn: { padding: "10px 20px", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "0.9rem" },
  title: { color: "#fff", fontSize: "1.8rem", fontWeight: "800", margin: 0 },
  streakCard: { background: "linear-gradient(135deg, rgba(108,99,255,0.2), rgba(59,130,246,0.2))", borderRadius: "20px", padding: "24px 32px", border: "1px solid rgba(108,99,255,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  streakLeft: { display: "flex", alignItems: "center", gap: "16px" },
  streakEmoji: { fontSize: "3rem" },
  streakNumber: { color: "#fff", fontSize: "2.5rem", fontWeight: "900", margin: 0 },
  streakLabel: { color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", margin: 0 },
  streakRight: { display: "flex", gap: "24px" },
  pointsBox: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" },
  pointsValue: { color: "#fff", fontSize: "1.5rem", fontWeight: "800" },
  pointsLabel: { color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" },
  milestonesCard: { background: "rgba(255,255,255,0.04)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "24px" },
  milestonesTitle: { color: "#fff", fontSize: "1rem", fontWeight: "700", marginBottom: "16px" },
  milestones: { display: "flex", gap: "12px", flexWrap: "wrap" },
  milestone: { background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "12px 16px", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center", minWidth: "80px" },
  milestoneDone: { background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" },
  milestoneEmoji: { fontSize: "1.5rem", marginBottom: "4px" },
  milestoneDays: { color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", fontWeight: "600" },
  milestoneTick: { fontSize: "0.8rem", marginTop: "4px" },
  todayCard: { background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.15))", borderRadius: "20px", padding: "24px", border: "1px solid rgba(245,158,11,0.3)", marginBottom: "24px" },
  todayBadge: { display: "inline-block", background: "rgba(245,158,11,0.3)", color: "#fcd34d", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "700", marginBottom: "12px" },
  todayTitle: { color: "#fff", fontSize: "1.3rem", fontWeight: "800", marginBottom: "8px" },
  todayDesc: { color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", marginBottom: "16px" },
  todayFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  todayPoints: { color: "#fcd34d", fontSize: "1.1rem", fontWeight: "700" },
  doneBtn: { padding: "10px 24px", background: "linear-gradient(135deg, #f59e0b, #ef4444)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer" },
  doneBtnDone: { background: "rgba(16,185,129,0.3)", cursor: "default" },
  sectionTitle: { color: "#fff", fontSize: "1.2rem", fontWeight: "700", marginBottom: "16px" },
  challengesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", marginBottom: "24px" },
  challengeCard: { background: "rgba(255,255,255,0.04)", borderRadius: "16px", padding: "20px", border: "1px solid rgba(255,255,255,0.08)" },
  challengeDone: { background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" },
  challengeHeader: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
  challengeType: { color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase" },
  challengePoints: { color: "#fcd34d", fontSize: "0.85rem", fontWeight: "700" },
  challengeTitle: { color: "#fff", fontSize: "1rem", fontWeight: "700", marginBottom: "6px" },
  challengeDesc: { color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", marginBottom: "14px", lineHeight: "1.5" },
  completeBtn: { width: "100%", padding: "10px", background: "linear-gradient(135deg, #6c63ff, #3b82f6)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "0.9rem", fontWeight: "600", cursor: "pointer" },
  completeBtnDone: { background: "rgba(16,185,129,0.3)", cursor: "default" },
  resetBtn: { padding: "10px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.85rem" },
};