import { useState } from "react";
import LoginRegister from './LoginRegister';
import Dashboard from './Dashboard';
import AdminPanel from './AdminPanel';
import Profile from './Profile';
import Quiz from './Quiz';
import Leaderboard from './Leaderboard';
import SignDetector from './SignDetector';
import Chat from './Chat';
import Analytics from './Analytics';
import Dictionary from './Dictionary';
import DailyChallenge from './DailyChallenge';
import Certificate from './Certificate';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [page, setPage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(true);
  const [certData, setCertData] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogin = (newToken) => {
    setToken(newToken);
    setPage("dashboard");
  };

  if (!token) return <LoginRegister onLogin={handleLogin} />;
  if (page === "admin") return <AdminPanel onBack={() => setPage("dashboard")} />;
  if (page === "profile") return <Profile onBack={() => setPage("dashboard")} />;
  if (page === "quiz") return <Quiz onBack={() => setPage("dashboard")} />;
  if (page === "leaderboard") return <Leaderboard onBack={() => setPage("dashboard")} />;
  if (page === "detector") return <SignDetector onBack={() => setPage("dashboard")} />;
  if (page === "chat") return <Chat onBack={() => setPage("dashboard")} />;
  if (page === "analytics") return <Analytics onBack={() => setPage("dashboard")} />;
  if (page === "dictionary") return <Dictionary onBack={() => setPage("dashboard")} />;
  if (page === "challenge") return <DailyChallenge onBack={() => setPage("dashboard")} />;
  if (page === "certificate") return (
    <Certificate
      onBack={() => setPage("dashboard")}
      userName={certData?.userName || user?.name}
      lessonTitle={certData?.lessonTitle || "Sign Language Course"}
      score={certData?.score || 100}
    />
  );

  return (
    <Dashboard
      onAdmin={() => setPage("admin")}
      onProfile={() => setPage("profile")}
      onQuiz={() => setPage("quiz")}
      onLeaderboard={() => setPage("leaderboard")}
      onDetector={() => setPage("detector")}
      onChat={() => setPage("chat")}
      onAnalytics={() => setPage("analytics")}
      onDictionary={() => setPage("dictionary")}
      onChallenge={() => setPage("challenge")}
      onCertificate={(data) => { setCertData(data); setPage("certificate"); }}
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode(!darkMode)}
    />
  );
}

export default App;