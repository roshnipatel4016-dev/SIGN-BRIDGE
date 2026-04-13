import { useState } from "react";

const API = "http://localhost:5000/api";

export default function Profile({ onBack }) {
  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [form, setForm] = useState({ name: savedUser.name || "", bio: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch(`${API}/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem("user", JSON.stringify({ ...savedUser, name: data.name }));
      setSuccess("Profile update ho gaya! ✅");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <h1 style={styles.title}>👤 Profile Edit</h1>
      </div>
      <div style={styles.card}>
        <div style={styles.avatar}>{savedUser.name?.[0]?.toUpperCase() || "U"}</div>
        <p style={styles.email}>{savedUser.email}</p>
        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Naam</label>
            <input style={styles.input} name="name" value={form.name} onChange={handleChange} placeholder="Tumhara naam" />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Bio</label>
            <textarea style={{ ...styles.input, height: "80px", resize: "none" }} name="bio" value={form.bio} onChange={handleChange} placeholder="Apne baare mein likho" />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Naya Password (optional)</label>
            <input style={styles.input} name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
          </div>
          {error && <div style={styles.errorBox}>❌ {error}</div>}
          {success && <div style={styles.successBox}>{success}</div>}
          <button style={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Profile Save Karo →"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0f0f1a", padding: "32px", fontFamily: "'Segoe UI', sans-serif", display: "flex", flexDirection: "column", alignItems: "center" },
  header: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px", width: "100%", maxWidth: "500px" },
  backBtn: { padding: "10px 20px", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "0.9rem" },
  title: { color: "#fff", fontSize: "1.8rem", fontWeight: "800", margin: 0 },
  card: { background: "rgba(255,255,255,0.04)", borderRadius: "24px", padding: "40px", border: "1px solid rgba(255,255,255,0.08)", width: "100%", maxWidth: "500px" },
  avatar: { width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #6c63ff, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "2rem", fontWeight: "700", margin: "0 auto 16px" },
  email: { color: "rgba(255,255,255,0.4)", fontSize: "0.95rem", textAlign: "center", marginBottom: "32px" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", fontWeight: "600" },
  input: { padding: "12px 16px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "0.95rem", outline: "none", width: "100%", boxSizing: "border-box" },
  errorBox: { background: "rgba(255,80,80,0.15)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff8080", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem" },
  successBox: { background: "rgba(80,255,150,0.15)", border: "1px solid rgba(80,255,150,0.3)", color: "#80ffaa", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem" },
  submitBtn: { padding: "14px", background: "linear-gradient(135deg, #6c63ff, #3b82f6)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "1rem", fontWeight: "700", cursor: "pointer" },
};