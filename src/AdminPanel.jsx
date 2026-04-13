import { useState, useEffect } from "react";

const API = "http://localhost:5000/api";

export default function AdminPanel({ onBack }) {
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", category: "", difficulty: "beginner", videoUrl: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => { fetchLessons(); }, []);

  const fetchLessons = async () => {
    try {
      const res = await fetch(`${API}/lessons`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setLessons(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.title || !form.category) { setError("Title aur Category zaroori hai!"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch(`${API}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess("Lesson add ho gaya! ✅");
      setForm({ title: "", description: "", category: "", difficulty: "beginner", videoUrl: "", content: "" });
      fetchLessons();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/lessons/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      fetchLessons();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <h1 style={styles.title}>🛠️ Admin Panel</h1>
      </div>

      <div style={styles.grid}>
        {/* Add Lesson Form */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>➕ Naya Lesson Add Karo</h2>
          <div style={styles.form}>
            <input style={styles.input} name="title" placeholder="Lesson Title *" value={form.title} onChange={handleChange} />
            <input style={styles.input} name="category" placeholder="Category (e.g. Alphabets, Numbers) *" value={form.category} onChange={handleChange} />
            <select style={styles.input} name="difficulty" value={form.difficulty} onChange={handleChange}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <textarea style={{ ...styles.input, height: "80px", resize: "none" }} name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <input style={styles.input} name="videoUrl" placeholder="Video URL (optional)" value={form.videoUrl} onChange={handleChange} />
            <textarea style={{ ...styles.input, height: "100px", resize: "none" }} name="content" placeholder="Lesson Content (optional)" value={form.content} onChange={handleChange} />
            {error && <div style={styles.errorBox}>❌ {error}</div>}
            {success && <div style={styles.successBox}>{success}</div>}
            <button style={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
              {loading ? "Adding..." : "Lesson Add Karo →"}
            </button>
          </div>
        </div>

        {/* Lessons List */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📚 All Lessons ({lessons.length})</h2>
          {lessons.length === 0 ? (
            <div style={styles.emptyBox}>
              <p style={styles.emptyText}>Koi lesson nahi hai abhi</p>
            </div>
          ) : (
            <div style={styles.lessonsList}>
              {lessons.map((lesson) => (
                <div key={lesson._id} style={styles.lessonItem}>
                  <div>
                    <p style={styles.lessonTitle}>{lesson.title}</p>
                    <p style={styles.lessonMeta}>{lesson.category} • {lesson.difficulty}</p>
                  </div>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(lesson._id)}>🗑️</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0f0f1a", padding: "32px", fontFamily: "'Segoe UI', sans-serif" },
  header: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" },
  backBtn: { padding: "10px 20px", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "0.9rem" },
  title: { color: "#fff", fontSize: "1.8rem", fontWeight: "800", margin: 0 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" },
  card: { background: "rgba(255,255,255,0.04)", borderRadius: "20px", padding: "28px", border: "1px solid rgba(255,255,255,0.08)" },
  cardTitle: { color: "#fff", fontSize: "1.2rem", fontWeight: "700", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: { padding: "12px 16px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "0.95rem", outline: "none", width: "100%", boxSizing: "border-box" },
  errorBox: { background: "rgba(255,80,80,0.15)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff8080", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem" },
  successBox: { background: "rgba(80,255,150,0.15)", border: "1px solid rgba(80,255,150,0.3)", color: "#80ffaa", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem" },
  submitBtn: { padding: "14px", background: "linear-gradient(135deg, #6c63ff, #3b82f6)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "1rem", fontWeight: "700", cursor: "pointer" },
  emptyBox: { textAlign: "center", padding: "40px" },
  emptyText: { color: "rgba(255,255,255,0.3)", fontSize: "1rem" },
  lessonsList: { display: "flex", flexDirection: "column", gap: "10px" },
  lessonItem: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "14px 16px", border: "1px solid rgba(255,255,255,0.08)" },
  lessonTitle: { color: "#fff", fontSize: "0.95rem", fontWeight: "600", margin: 0 },
  lessonMeta: { color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", marginTop: "4px" },
  deleteBtn: { background: "rgba(255,80,80,0.15)", border: "none", borderRadius: "8px", padding: "8px", cursor: "pointer", fontSize: "1rem" },
};