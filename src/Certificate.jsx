import { useRef } from "react";

export default function Certificate({ onBack, userName, lessonTitle, score, date }) {
  const certRef = useRef(null);

  const downloadCertificate = () => {
    const cert = certRef.current;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head><title>Certificate - ${userName}</title></head>
        <body style="margin:0;padding:0;background:#0f0f1a;">
          ${cert.outerHTML}
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const today = date || new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <h1 style={styles.title}>🏆 Certificate</h1>
        <button style={styles.downloadBtn} onClick={downloadCertificate}>⬇️ Download / Print</button>
      </div>

      <div ref={certRef} style={styles.certificate}>
        <div style={styles.certBorder}>
          <div style={styles.certInner}>
            <div style={styles.certTop}>
              <div style={styles.certLogo}>🤟</div>
              <h1 style={styles.certAppName}>SIGN3</h1>
              <p style={styles.certSubtitle}>Sign Language Learning Platform</p>
            </div>

            <div style={styles.certDivider} />

            <h2 style={styles.certHeading}>Certificate of Achievement</h2>
            <p style={styles.certText}>This is to certify that</p>
            <h3 style={styles.certName}>{userName || "Student"}</h3>
            <p style={styles.certText}>has successfully completed</p>
            <h4 style={styles.certLesson}>"{lessonTitle || "Sign Language Course"}"</h4>
            <p style={styles.certText}>with a score of</p>
            <div style={styles.certScore}>{score || 100}%</div>

            <div style={styles.certDivider} />

            <div style={styles.certFooter}>
              <div style={styles.certFooterItem}>
                <div style={styles.certSignature}>SIGN3 Team</div>
                <div style={styles.certFooterLabel}>Authorized By</div>
              </div>
              <div style={styles.certSeal}>🏆</div>
              <div style={styles.certFooterItem}>
                <div style={styles.certSignature}>{today}</div>
                <div style={styles.certFooterLabel}>Date of Completion</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0f0f1a", padding: "32px", fontFamily: "'Segoe UI', sans-serif" },
  header: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" },
  backBtn: { padding: "10px 20px", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "0.9rem" },
  title: { color: "#fff", fontSize: "1.8rem", fontWeight: "800", margin: 0, flex: 1 },
  downloadBtn: { padding: "12px 24px", background: "linear-gradient(135deg, #6c63ff, #3b82f6)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "0.95rem", fontWeight: "700", cursor: "pointer" },
  certificate: { maxWidth: "800px", margin: "0 auto" },
  certBorder: { background: "linear-gradient(135deg, #6c63ff, #3b82f6, #10b981)", padding: "4px", borderRadius: "24px" },
  certInner: { background: "#0f0f1a", borderRadius: "22px", padding: "48px", textAlign: "center" },
  certTop: { marginBottom: "24px" },
  certLogo: { fontSize: "3rem", marginBottom: "8px" },
  certAppName: { color: "#fff", fontSize: "2rem", fontWeight: "900", letterSpacing: "4px", margin: 0 },
  certSubtitle: { color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", marginTop: "4px" },
  certDivider: { height: "1px", background: "linear-gradient(90deg, transparent, rgba(108,99,255,0.5), transparent)", margin: "24px 0" },
  certHeading: { color: "#a78bfa", fontSize: "1.5rem", fontWeight: "700", marginBottom: "24px", letterSpacing: "2px" },
  certText: { color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", margin: "8px 0" },
  certName: { color: "#fff", fontSize: "2.5rem", fontWeight: "900", margin: "12px 0", background: "linear-gradient(135deg, #6c63ff, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  certLesson: { color: "#fcd34d", fontSize: "1.3rem", fontWeight: "700", margin: "12px 0" },
  certScore: { display: "inline-block", background: "linear-gradient(135deg, #10b981, #3b82f6)", color: "#fff", fontSize: "2.5rem", fontWeight: "900", padding: "12px 32px", borderRadius: "16px", margin: "12px 0" },
  certFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" },
  certFooterItem: { textAlign: "center" },
  certSignature: { color: "#fff", fontSize: "1.1rem", fontWeight: "700", borderBottom: "2px solid rgba(255,255,255,0.2)", paddingBottom: "8px", marginBottom: "8px" },
  certFooterLabel: { color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" },
  certSeal: { fontSize: "4rem" },
};