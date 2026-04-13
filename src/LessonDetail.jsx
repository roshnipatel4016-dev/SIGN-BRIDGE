import { useState } from "react";

export default function LessonDetail({ lesson, onBack, darkMode, token }) {
  const [completed, setCompleted] = useState(false);
  const [currentSign, setCurrentSign] = useState(0);

  const bg = darkMode ? "#0f0f1a" : "#f0f2f5";
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "#ffffff";
  const textColor = darkMode ? "#ffffff" : "#1a1a2e";
  const subTextColor = darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const stepBg = darkMode ? "rgba(255,255,255,0.05)" : "#f8f9fa";

  const diffColors = {
    Beginner: "#10b981", beginner: "#10b981",
    Intermediate: "#f59e0b", intermediate: "#f59e0b",
    Advanced: "#ef4444", advanced: "#ef4444",
  };

  const signs = lesson.signs || [];
  const videoUrl = lesson.videoUrl || null;

  return (
    <div style={{ minHeight: "100vh", background: bg, padding: "32px", fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{ padding: "10px 20px", background: "rgba(108,99,255,0.2)", border: "1px solid #6c63ff", borderRadius: "10px", color: "#a78bfa", cursor: "pointer", fontSize: "0.9rem", marginBottom: "24px" }}>
        ← Wapas Jao
      </button>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        {/* Lesson Header */}
        <div style={{ background: cardBg, borderRadius: "20px", padding: "32px", marginBottom: "24px" }}>
          <span style={{ background: diffColors[lesson.difficulty] || "#6c63ff", padding: "4px 14px", borderRadius: "20px", color: "#fff", fontSize: "0.8rem", fontWeight: "600" }}>
            {lesson.difficulty}
          </span>
          {lesson.duration && (
            <span style={{ background: "rgba(108,99,255,0.2)", border: "1px solid #6c63ff", padding: "4px 14px", borderRadius: "20px", color: "#a78bfa", fontSize: "0.8rem", fontWeight: "600", marginLeft: "8px" }}>
              ⏱ {lesson.duration}
            </span>
          )}
          <h1 style={{ color: textColor, fontSize: "2rem", fontWeight: "800", margin: "16px 0 8px" }}>{lesson.title}</h1>
          <p style={{ color: subTextColor, fontSize: "1rem" }}>{lesson.description}</p>
          <p style={{ color: subTextColor, fontSize: "0.85rem", marginTop: "8px" }}>📂 Category: {lesson.category}</p>
        </div>

        {/* YouTube Video Player */}
        {videoUrl && (
          <div style={{ background: cardBg, borderRadius: "20px", padding: "24px", marginBottom: "24px" }}>
            <h2 style={{ color: textColor, marginBottom: "16px", fontSize: "1.3rem" }}>🎬 Lesson Video:</h2>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "12px", overflow: "hidden" }}>
              <iframe
                src={videoUrl}
                title={lesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: "12px" }}
              />
            </div>
          </div>
        )}

        {/* Signs Section */}
        {signs.length > 0 && (
          <div style={{ background: cardBg, borderRadius: "20px", padding: "32px", marginBottom: "24px" }}>
            <h2 style={{ color: textColor, marginBottom: "20px", fontSize: "1.3rem" }}>🤟 Is Lesson Ke Signs:</h2>
            
            {/* Signs Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "20px" }}>
              {signs.map((sign, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentSign(i)}
                  style={{
                    padding: "16px",
                    background: currentSign === i
                      ? "rgba(108,99,255,0.2)"
                      : stepBg,
                    border: currentSign === i
                      ? "2px solid #6c63ff"
                      : "1px solid transparent",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}>
                  <div style={{ fontSize: "1.2rem", fontWeight: "700", color: currentSign === i ? "#a78bfa" : textColor, marginBottom: "6px" }}>
                    {sign.word}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: subTextColor, lineHeight: "1.4" }}>
                    {sign.hint}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Sign Detail */}
            <div style={{ background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: "16px", padding: "20px" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#a78bfa", marginBottom: "8px" }}>
                🤟 {signs[currentSign]?.word}
              </div>
              <div style={{ fontSize: "1rem", color: textColor, lineHeight: "1.6" }}>
                👉 {signs[currentSign]?.hint}
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                <button
                  onClick={() => setCurrentSign(Math.max(0, currentSign - 1))}
                  disabled={currentSign === 0}
                  style={{ padding: "8px 16px", background: "rgba(108,99,255,0.2)", border: "1px solid #6c63ff", borderRadius: "8px", color: "#a78bfa", cursor: currentSign === 0 ? "not-allowed" : "pointer", opacity: currentSign === 0 ? 0.4 : 1, fontSize: "0.9rem" }}>
                  ← Pichla
                </button>
                <span style={{ color: subTextColor, fontSize: "0.9rem", alignSelf: "center" }}>
                  {currentSign + 1} / {signs.length}
                </span>
                <button
                  onClick={() => setCurrentSign(Math.min(signs.length - 1, currentSign + 1))}
                  disabled={currentSign === signs.length - 1}
                  style={{ padding: "8px 16px", background: "rgba(108,99,255,0.2)", border: "1px solid #6c63ff", borderRadius: "8px", color: "#a78bfa", cursor: currentSign === signs.length - 1 ? "not-allowed" : "pointer", opacity: currentSign === signs.length - 1 ? 0.4 : 1, fontSize: "0.9rem" }}>
                  Agla →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Steps Section */}
        <div style={{ background: cardBg, borderRadius: "20px", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ color: textColor, marginBottom: "20px", fontSize: "1.3rem" }}>📋 Lesson Kaise Karein:</h2>
          {[
            "🎬 Pehle upar wala video dekho poora",
            "🤟 Har sign ko dhyan se dekho",
            "✋ Khud haath se practice karo",
            "✅ Neeche Complete button dabao"
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "14px", background: stepBg, borderRadius: "12px", marginBottom: "12px" }}>
              <span style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#6c63ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "0.9rem", flexShrink: 0 }}>{i + 1}</span>
              <span style={{ color: textColor, fontSize: "1rem" }}>{step}</span>
            </div>
          ))}
        </div>

        {/* Tip Section */}
        <div style={{ background: cardBg, borderRadius: "20px", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ color: textColor, marginBottom: "12px", fontSize: "1.3rem" }}>💡 Tip:</h2>
          <p style={{ color: subTextColor, fontSize: "1rem", lineHeight: "1.6" }}>
            Roz thodi thodi practice karo — ek hafte mein signs yaad ho jayenge! Video ko slow speed pe bhi dekh sakte ho. 🙌
          </p>
        </div>

        {/* Complete Button */}
        {!completed ? (
          <button
            onClick={() => setCompleted(true)}
            style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg, #6c63ff, #3b82f6)", border: "none", borderRadius: "14px", color: "#fff", fontSize: "1.1rem", fontWeight: "700", cursor: "pointer" }}>
            ✅ Maine Seekh Liya! Complete Karo
          </button>
        ) : (
          <div style={{ textAlign: "center", padding: "32px", background: "rgba(16,185,129,0.1)", border: "1px solid #10b981", borderRadius: "14px" }}>
            <div style={{ fontSize: "4rem", marginBottom: "12px" }}>🎉</div>
            <p style={{ color: "#10b981", fontSize: "1.4rem", fontWeight: "700", marginBottom: "8px" }}>Bahut Achha! Lesson Complete!</p>
            <p style={{ color: subTextColor, fontSize: "0.95rem", marginBottom: "20px" }}>Ab agla lesson try karo ya phir se practice karo!</p>
            <button
              onClick={onBack}
              style={{ padding: "12px 32px", background: "#10b981", border: "none", borderRadius: "10px", color: "#fff", fontWeight: "700", cursor: "pointer", fontSize: "1rem" }}>
              Agle Lesson Pe Jao →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}