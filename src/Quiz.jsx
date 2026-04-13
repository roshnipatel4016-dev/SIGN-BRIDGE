import { useState } from "react";

const quizData = [
  { id: 1, question: "Sign Language mein 'Hello' kaise karte hain?", options: ["Haath hilana", "Sar hilana", "Aankhein band karna", "Muskurana"], answer: 0, emoji: "👋" },
  { id: 2, question: "ASL mein 'I Love You' ka sign kya hai?", options: ["✌️ Peace sign", "🤟 ILY sign", "👍 Thumbs up", "🤙 Call me"], answer: 1, emoji: "🤟" },
  { id: 3, question: "Sign Language mein alphabets ko kya kehte hain?", options: ["Sign Alphabet", "Fingerspelling", "Hand Signals", "Gesture Code"], answer: 1, emoji: "🖐️" },
  { id: 4, question: "Konsa desh Sign Language sabse pehle officially recognize kiya?", options: ["USA", "UK", "France", "India"], answer: 2, emoji: "🌍" },
  { id: 5, question: "Sign Language mein expressions ka kya role hai?", options: ["Koi role nahi", "Sirf decoration", "Bahut zaroori - meaning change karta hai", "Optional hai"], answer: 2, emoji: "😊" },
];

export default function Quiz({ onBack }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const q = quizData[current];

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.answer) setScore(score + 1);
  };

  const handleNext = () => {
    if (current + 1 < quizData.length) {
      setCurrent(current + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswered(false);
  };

  const percent = Math.round((score / quizData.length) * 100);

  if (finished) return (
    <div style={styles.page}>
      <div style={styles.resultCard}>
        <div style={styles.resultEmoji}>
          {percent >= 80 ? "🏆" : percent >= 60 ? "⭐" : "💪"}
        </div>
        <h1 style={styles.resultTitle}>Quiz Complete!</h1>
        <p style={styles.resultScore}>{score}/{quizData.length} Sahi</p>
        <div style={{ ...styles.resultBadge, background: percent >= 80 ? "#10b981" : percent >= 60 ? "#f59e0b" : "#ef4444" }}>
          {percent}% Score
        </div>
        <p style={styles.resultMsg}>
          {percent >= 80 ? "Shabash! Tum bahut achhe ho! 🎉" : percent >= 60 ? "Achha kiya! Aur practice karo! 💪" : "Koi baat nahi! Dobara try karo! 🔄"}
        </p>
        <div style={styles.resultBtns}>
          <button style={styles.restartBtn} onClick={handleRestart}>🔄 Dobara Khelo</button>
          <button style={styles.backBtn} onClick={onBack}>← Dashboard</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <h1 style={styles.title}>🧠 Sign Language Quiz</h1>
        <span style={styles.scoreDisplay}>Score: {score}/{quizData.length}</span>
      </div>

      {/* Progress bar */}
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${((current + 1) / quizData.length) * 100}%` }} />
      </div>
      <p style={styles.progressText}>Question {current + 1} of {quizData.length}</p>

      <div style={styles.quizCard}>
        <div style={styles.questionEmoji}>{q.emoji}</div>
        <h2 style={styles.question}>{q.question}</h2>
        <div style={styles.options}>
          {q.options.map((opt, idx) => {
            let bg = "rgba(255,255,255,0.04)";
            let border = "1px solid rgba(255,255,255,0.08)";
            if (answered) {
              if (idx === q.answer) { bg = "rgba(16,185,129,0.2)"; border = "1px solid #10b981"; }
              else if (idx === selected) { bg = "rgba(239,68,68,0.2)"; border = "1px solid #ef4444"; }
            } else if (selected === idx) {
              bg = "rgba(108,99,255,0.2)"; border = "1px solid #6c63ff";
            }
            return (
              <button key={idx} style={{ ...styles.option, background: bg, border }}
                onClick={() => handleSelect(idx)}>
                <span style={styles.optionLetter}>{["A", "B", "C", "D"][idx]}</span>
                <span style={styles.optionText}>{opt}</span>
                {answered && idx === q.answer && <span style={styles.correctMark}>✅</span>}
                {answered && idx === selected && idx !== q.answer && <span style={styles.wrongMark}>❌</span>}
              </button>
            );
          })}
        </div>
        {answered && (
          <button style={styles.nextBtn} onClick={handleNext}>
            {current + 1 < quizData.length ? "Agla Question →" : "Result Dekho 🏆"}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0f0f1a", padding: "32px", fontFamily: "'Segoe UI', sans-serif" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" },
  backBtn: { padding: "10px 20px", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "0.9rem" },
  title: { color: "#fff", fontSize: "1.8rem", fontWeight: "800", margin: 0 },
  scoreDisplay: { color: "#a78bfa", fontSize: "1rem", fontWeight: "700", background: "rgba(108,99,255,0.15)", padding: "8px 16px", borderRadius: "20px" },
  progressBar: { background: "rgba(255,255,255,0.08)", borderRadius: "10px", height: "8px", marginBottom: "8px" },
  progressFill: { background: "linear-gradient(135deg, #6c63ff, #3b82f6)", height: "100%", borderRadius: "10px", transition: "width 0.3s" },
  progressText: { color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", marginBottom: "24px" },
  quizCard: { background: "rgba(255,255,255,0.04)", borderRadius: "24px", padding: "40px", border: "1px solid rgba(255,255,255,0.08)", maxWidth: "700px", margin: "0 auto" },
  questionEmoji: { fontSize: "3rem", textAlign: "center", marginBottom: "16px" },
  question: { color: "#fff", fontSize: "1.3rem", fontWeight: "700", textAlign: "center", marginBottom: "32px", lineHeight: "1.5" },
  options: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" },
  option: { display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s", textAlign: "left" },
  optionLetter: { width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "0.9rem", flexShrink: 0 },
  optionText: { color: "#fff", fontSize: "1rem", flex: 1 },
  correctMark: { fontSize: "1.2rem" },
  wrongMark: { fontSize: "1.2rem" },
  nextBtn: { width: "100%", padding: "16px", background: "linear-gradient(135deg, #6c63ff, #3b82f6)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "1rem", fontWeight: "700", cursor: "pointer" },
  resultCard: { background: "rgba(255,255,255,0.04)", borderRadius: "24px", padding: "48px", border: "1px solid rgba(255,255,255,0.08)", maxWidth: "500px", margin: "80px auto", textAlign: "center" },
  resultEmoji: { fontSize: "5rem", marginBottom: "16px" },
  resultTitle: { color: "#fff", fontSize: "2rem", fontWeight: "800", marginBottom: "8px" },
  resultScore: { color: "rgba(255,255,255,0.6)", fontSize: "1.2rem", marginBottom: "16px" },
  resultBadge: { display: "inline-block", padding: "8px 24px", borderRadius: "20px", color: "#fff", fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px" },
  resultMsg: { color: "rgba(255,255,255,0.6)", fontSize: "1rem", marginBottom: "32px" },
  resultBtns: { display: "flex", gap: "12px", justifyContent: "center" },
  restartBtn: { padding: "12px 24px", background: "linear-gradient(135deg, #6c63ff, #3b82f6)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "0.95rem", fontWeight: "700", cursor: "pointer" },
};