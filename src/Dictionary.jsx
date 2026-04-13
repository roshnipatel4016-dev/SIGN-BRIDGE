import { useState } from "react";

const signs = [
  { letter: "A", description: "Mutthi band karo, thumb side pe rakho", emoji: "✊", tip: "Thumb bahar nahi nikalna" },
  { letter: "B", description: "Charon ungliyan seedhi rakho, thumb andar dabaao", emoji: "🖐️", tip: "Ungliyan bilkul seedhi rakho" },
  { letter: "C", description: "Haath ko C shape mein modhon", emoji: "🤏", tip: "Haath thoda khula rakho" },
  { letter: "D", description: "Index finger upar, baaki se circle banao", emoji: "☝️", tip: "Circle perfect banana" },
  { letter: "E", description: "Charon ungliyan modhon, thumb neeche", emoji: "🤜", tip: "Ungliyan zyada na modho" },
  { letter: "F", description: "Index aur thumb circle banao, baaki upar", emoji: "👌", tip: "OK sign jaisa hai" },
  { letter: "G", description: "Index aur thumb horizontal point karo", emoji: "👉", tip: "Side mein point karo" },
  { letter: "H", description: "Index aur middle finger horizontal rakho", emoji: "✌️", tip: "Side mein rakho, upar nahi" },
  { letter: "I", description: "Sirf pinky finger upar rakho", emoji: "🤙", tip: "Sirf choti ungli" },
  { letter: "J", description: "Pinky se J shape banao hawa mein", emoji: "🤙", tip: "Haath bhi hilana padega" },
  { letter: "K", description: "Index upar, middle diagonal, thumb beech mein", emoji: "✌️", tip: "Teen points banana" },
  { letter: "L", description: "Index upar, thumb side mein - L shape", emoji: "👆", tip: "L jaisa dikhna chahiye" },
  { letter: "M", description: "Teen ungliyan thumb ke upar modhon", emoji: "🤜", tip: "Teen ungliyan rakho" },
  { letter: "N", description: "Do ungliyan thumb ke upar modhon", emoji: "✌️", tip: "Do ungliyan rakho" },
  { letter: "O", description: "Sabhi ungliyan milake O shape banao", emoji: "👌", tip: "Perfect circle banana" },
  { letter: "P", description: "K jaisa par neeche ki taraf point karo", emoji: "👇", tip: "Neeche point karo" },
  { letter: "Q", description: "G jaisa par neeche ki taraf point karo", emoji: "👇", tip: "Neeche point karo" },
  { letter: "R", description: "Index aur middle ko cross karo", emoji: "🤞", tip: "Cross karna zaroori hai" },
  { letter: "S", description: "Mutthi band karo, thumb ungliyon ke upar", emoji: "✊", tip: "Thumb bahar rakho" },
  { letter: "T", description: "Thumb index aur middle ke beech mein", emoji: "🤜", tip: "Thumb andar dabaao" },
  { letter: "U", description: "Index aur middle saath upar rakho", emoji: "✌️", tip: "Saath mein rakho" },
  { letter: "V", description: "Index aur middle V shape mein kholo", emoji: "✌️", tip: "Victory sign" },
  { letter: "W", description: "Teen ungliyan W shape mein kholo", emoji: "🖖", tip: "Teen ungliyan" },
  { letter: "X", description: "Index finger hook shape mein modhon", emoji: "☝️", tip: "Thoda modho" },
  { letter: "Y", description: "Thumb aur pinky kholo, baaki band", emoji: "🤙", tip: "Call me sign" },
  { letter: "Z", description: "Index se hawa mein Z banao", emoji: "☝️", tip: "Haath hilana padega" },
];

const numbers = [
  { letter: "1", description: "Sirf index finger upar rakho", emoji: "☝️", tip: "Seedha upar" },
  { letter: "2", description: "Index aur middle upar rakho", emoji: "✌️", tip: "Peace sign" },
  { letter: "3", description: "Index, middle aur ring upar rakho", emoji: "🤟", tip: "Teen ungliyan" },
  { letter: "4", description: "Charon ungliyan upar, thumb andar", emoji: "🖐️", tip: "Thumb band" },
  { letter: "5", description: "Sabhi ungliyan kholo", emoji: "🖐️", tip: "Open hand" },
  { letter: "6", description: "Pinky aur thumb milao, baaki kholo", emoji: "🤙", tip: "Connect karo" },
  { letter: "7", description: "Ring aur thumb milao, baaki kholo", emoji: "👌", tip: "Connect karo" },
  { letter: "8", description: "Middle aur thumb milao, baaki kholo", emoji: "👌", tip: "Connect karo" },
  { letter: "9", description: "Index aur thumb milao, baaki kholo", emoji: "👌", tip: "OK sign" },
  { letter: "10", description: "Thumb upar karke haath hilao", emoji: "👍", tip: "Thumbs up + shake" },
];

export default function Dictionary({ onBack }) {
  const [tab, setTab] = useState("alphabets");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const data = tab === "alphabets" ? signs : numbers;
  const filtered = data.filter(s => s.letter.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <h1 style={styles.title}>📖 Sign Language Dictionary</h1>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button style={{ ...styles.tab, ...(tab === "alphabets" ? styles.tabActive : {}) }} onClick={() => setTab("alphabets")}>
          🔤 Alphabets (A-Z)
        </button>
        <button style={{ ...styles.tab, ...(tab === "numbers" ? styles.tabActive : {}) }} onClick={() => setTab("numbers")}>
          🔢 Numbers (1-10)
        </button>
      </div>

      {/* Search */}
      <div style={styles.searchBar}>
        <input style={styles.searchInput} placeholder="🔍 Search karo..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div style={styles.grid}>
        {/* Cards */}
        <div style={styles.cardsGrid}>
          {filtered.map((s, i) => (
            <div key={i} style={{ ...styles.card, ...(selected?.letter === s.letter ? styles.cardActive : {}) }}
              onClick={() => setSelected(s)}>
              <div style={styles.cardEmoji}>{s.emoji}</div>
              <div style={styles.cardLetter}>{s.letter}</div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={styles.detailCard}>
            <div style={styles.detailEmoji}>{selected.emoji}</div>
            <h2 style={styles.detailLetter}>{selected.letter}</h2>
            <div style={styles.detailSection}>
              <p style={styles.detailLabel}>📝 Kaise Karte Hain:</p>
              <p style={styles.detailText}>{selected.description}</p>
            </div>
            <div style={styles.detailSection}>
              <p style={styles.detailLabel}>💡 Tip:</p>
              <p style={styles.detailTip}>{selected.tip}</p>
            </div>
            <button style={styles.practiceBtn} onClick={() => {
              const utter = new SpeechSynthesisUtterance(`${selected.letter}. ${selected.description}`);
              utter.lang = "hi-IN";
              window.speechSynthesis.speak(utter);
            }}>
              🔊 Sunao
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0f0f1a", padding: "32px", fontFamily: "'Segoe UI', sans-serif" },
  header: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" },
  backBtn: { padding: "10px 20px", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "0.9rem" },
  title: { color: "#fff", fontSize: "1.8rem", fontWeight: "800", margin: 0 },
  tabs: { display: "flex", gap: "12px", marginBottom: "20px" },
  tab: { padding: "12px 24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "0.95rem", fontWeight: "600" },
  tabActive: { background: "rgba(108,99,255,0.2)", border: "1px solid #6c63ff", color: "#fff" },
  searchBar: { marginBottom: "24px" },
  searchInput: { width: "300px", padding: "12px 16px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: "0.95rem", outline: "none" },
  grid: { display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" },
  cardsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "12px" },
  card: { background: "rgba(255,255,255,0.04)", borderRadius: "16px", padding: "20px 12px", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center", cursor: "pointer", transition: "all 0.2s" },
  cardActive: { background: "rgba(108,99,255,0.2)", border: "1px solid #6c63ff" },
  cardEmoji: { fontSize: "2rem", marginBottom: "8px" },
  cardLetter: { color: "#fff", fontSize: "1.2rem", fontWeight: "800" },
  detailCard: { background: "rgba(255,255,255,0.04)", borderRadius: "20px", padding: "32px", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center", position: "sticky", top: "20px" },
  detailEmoji: { fontSize: "4rem", marginBottom: "16px" },
  detailLetter: { color: "#fff", fontSize: "3rem", fontWeight: "900", marginBottom: "24px" },
  detailSection: { background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "16px", marginBottom: "12px", textAlign: "left" },
  detailLabel: { color: "#a78bfa", fontSize: "0.85rem", fontWeight: "700", marginBottom: "8px" },
  detailText: { color: "#fff", fontSize: "0.95rem", lineHeight: "1.6" },
  detailTip: { color: "#6ee7b7", fontSize: "0.9rem", lineHeight: "1.5" },
  practiceBtn: { width: "100%", padding: "14px", background: "linear-gradient(135deg, #6c63ff, #3b82f6)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "1rem", fontWeight: "700", cursor: "pointer", marginTop: "8px" },
};