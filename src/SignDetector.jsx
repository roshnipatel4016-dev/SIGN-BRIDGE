import { useState, useEffect, useRef } from "react";

export default function SignDetector({ onBack }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [detectedSign, setDetectedSign] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const modelRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    loadModel();
    return () => {
      stopCamera();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const loadModel = async () => {
    try {
      const script1 = document.createElement("script");
      script1.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs";
      document.head.appendChild(script1);
      script1.onload = async () => {
        const script2 = document.createElement("script");
        script2.src = "https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose";
        document.head.appendChild(script2);
        script2.onload = async () => {
          try {
            modelRef.current = await window.handpose.load();
            setLoading(false);
          } catch (e) {
            setError("Model load nahi hua");
            setLoading(false);
          }
        };
      };
    } catch (e) {
      setError("TensorFlow load nahi hua");
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCameraOn(true);
      intervalRef.current = setInterval(detectHand, 500);
    } catch (e) {
      setError("Camera access nahi mila! Permission do.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCameraOn(false);
  };

  const detectHand = async () => {
    if (!modelRef.current || !videoRef.current || !canvasRef.current) return;
    try {
      const predictions = await modelRef.current.estimateHands(videoRef.current);
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (predictions.length > 0) {
        const landmarks = predictions[0].landmarks;
        drawHand(ctx, landmarks);
        const sign = recognizeSign(landmarks);
        if (sign && sign !== detectedSign) {
          setDetectedSign(sign);
          speak(sign);
          setHistory(prev => [{ sign, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 9)]);
        }
      }
    } catch (e) { console.error(e); }
  };

  const drawHand = (ctx, landmarks) => {
    ctx.fillStyle = "#6c63ff";
    landmarks.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
    const connections = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[0,9],[9,10],[10,11],[11,12],[0,13],[13,14],[14,15],[15,16],[0,17],[17,18],[18,19],[19,20]];
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    connections.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(landmarks[a][0], landmarks[a][1]);
      ctx.lineTo(landmarks[b][0], landmarks[b][1]);
      ctx.stroke();
    });
  };

  const recognizeSign = (landmarks) => {
    const fingers = getFingerStates(landmarks);
    const [thumb, index, middle, ring, pinky] = fingers;

    if (index && middle && !ring && !pinky && !thumb) return "Victory ✌️";
    if (index && !middle && !ring && !pinky) return "Pointing ☝️";
    if (!index && !middle && !ring && !pinky && !thumb) return "Fist ✊";
    if (index && middle && ring && pinky && thumb) return "Open Hand 🖐️";
    if (thumb && index && !middle && !ring && !pinky) return "L Shape 👆";
    if (!index && !middle && !ring && !pinky && thumb) return "Thumbs Up 👍";
    if (thumb && pinky && !index && !middle && !ring) return "ILY 🤟";
    if (index && middle && ring && pinky && !thumb) return "Four Fingers 🖖";
    return "";
  };

  const getFingerStates = (landmarks) => {
    const tips = [4, 8, 12, 16, 20];
    const bases = [2, 6, 10, 14, 18];
    return tips.map((tip, i) => {
      if (i === 0) return landmarks[tip][0] < landmarks[bases[i]][0];
      return landmarks[tip][1] < landmarks[bases[i]][1];
    });
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text.replace(/[^\w\s]/gi, ""));
    utter.lang = "en-US";
    utter.rate = 0.9;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <h1 style={styles.title}>🤟 Live Sign Detector</h1>
        <span style={{ ...styles.statusBadge, background: cameraOn ? "#10b981" : "#6b7280" }}>
          {cameraOn ? "🔴 Live" : "⚫ Off"}
        </span>
      </div>

      <div style={styles.grid}>
        {/* Camera */}
        <div style={styles.cameraBox}>
          {loading ? (
            <div style={styles.loadingBox}>
              <div style={{ fontSize: "3rem" }}>🤖</div>
              <p style={styles.loadingText}>AI Model load ho raha hai...</p>
              <p style={styles.loadingSubText}>Thoda wait karo</p>
            </div>
          ) : error ? (
            <div style={styles.errorBox}>
              <div style={{ fontSize: "3rem" }}>❌</div>
              <p style={styles.errorText}>{error}</p>
            </div>
          ) : (
            <div style={styles.videoContainer}>
              <video ref={videoRef} style={styles.video} width="400" height="300" />
              <canvas ref={canvasRef} style={styles.canvas} width="400" height="300" />
            </div>
          )}

          {!loading && !error && (
            <button
              style={{ ...styles.cameraBtn, background: cameraOn ? "#ef4444" : "linear-gradient(135deg, #6c63ff, #3b82f6)" }}
              onClick={cameraOn ? stopCamera : startCamera}>
              {cameraOn ? "⏹️ Camera Band Karo" : "▶️ Camera Start Karo"}
            </button>
          )}
        </div>

        {/* Detection Result */}
        <div style={styles.rightPanel}>
          <div style={styles.detectionCard}>
            <p style={styles.detectionLabel}>Detected Sign</p>
            <div style={styles.detectionResult}>
              {detectedSign || "🤲"}
            </div>
            {speaking && <p style={styles.speakingText}>🔊 Bol raha hai...</p>}
          </div>

          {/* Instructions */}
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>📋 Signs jo detect hote hain:</h3>
            {[
              { sign: "✌️", name: "Victory - Index + Middle finger" },
              { sign: "☝️", name: "Pointing - Index finger" },
              { sign: "✊", name: "Fist - Sab band" },
              { sign: "🖐️", name: "Open Hand - Sab khule" },
              { sign: "👍", name: "Thumbs Up" },
              { sign: "🤟", name: "ILY - Thumb + Pinky" },
            ].map((item, i) => (
              <div key={i} style={styles.signItem}>
                <span style={styles.signEmoji}>{item.sign}</span>
                <span style={styles.signName}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div style={styles.historyCard}>
          <h3 style={styles.historyTitle}>📜 Detection History</h3>
          <div style={styles.historyList}>
            {history.map((h, i) => (
              <div key={i} style={styles.historyItem}>
                <span style={styles.historySign}>{h.sign}</span>
                <span style={styles.historyTime}>{h.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0f0f1a", padding: "32px", fontFamily: "'Segoe UI', sans-serif" },
  header: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" },
  backBtn: { padding: "10px 20px", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "0.9rem" },
  title: { color: "#fff", fontSize: "1.8rem", fontWeight: "800", margin: 0, flex: 1 },
  statusBadge: { padding: "6px 16px", borderRadius: "20px", color: "#fff", fontSize: "0.85rem", fontWeight: "600" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" },
  cameraBox: { background: "rgba(255,255,255,0.04)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" },
  loadingBox: { textAlign: "center", padding: "40px" },
  loadingText: { color: "#fff", fontSize: "1rem", fontWeight: "600", marginTop: "16px" },
  loadingSubText: { color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" },
  errorBox: { textAlign: "center", padding: "40px" },
  errorText: { color: "#ff8080", fontSize: "1rem", marginTop: "16px" },
  videoContainer: { position: "relative", borderRadius: "12px", overflow: "hidden" },
  video: { display: "block", borderRadius: "12px", transform: "scaleX(-1)" },
  canvas: { position: "absolute", top: 0, left: 0, transform: "scaleX(-1)" },
  cameraBtn: { padding: "14px 32px", border: "none", borderRadius: "12px", color: "#fff", fontSize: "1rem", fontWeight: "700", cursor: "pointer", width: "100%" },
  rightPanel: { display: "flex", flexDirection: "column", gap: "16px" },
  detectionCard: { background: "rgba(108,99,255,0.1)", borderRadius: "20px", padding: "32px", border: "1px solid rgba(108,99,255,0.3)", textAlign: "center" },
  detectionLabel: { color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: "16px" },
  detectionResult: { fontSize: "2.5rem", color: "#fff", fontWeight: "800", minHeight: "60px" },
  speakingText: { color: "#6ee7b7", fontSize: "0.9rem", marginTop: "12px" },
  infoCard: { background: "rgba(255,255,255,0.04)", borderRadius: "16px", padding: "20px", border: "1px solid rgba(255,255,255,0.08)" },
  infoTitle: { color: "#fff", fontSize: "1rem", fontWeight: "700", marginBottom: "12px" },
  signItem: { display: "flex", alignItems: "center", gap: "12px", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  signEmoji: { fontSize: "1.5rem" },
  signName: { color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" },
  historyCard: { background: "rgba(255,255,255,0.04)", borderRadius: "16px", padding: "20px", border: "1px solid rgba(255,255,255,0.08)" },
  historyTitle: { color: "#fff", fontSize: "1rem", fontWeight: "700", marginBottom: "12px" },
  historyList: { display: "flex", flexWrap: "wrap", gap: "8px" },
  historyItem: { background: "rgba(108,99,255,0.15)", borderRadius: "8px", padding: "6px 12px", display: "flex", gap: "8px", alignItems: "center" },
  historySign: { color: "#fff", fontSize: "0.9rem", fontWeight: "600" },
  historyTime: { color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" },
};