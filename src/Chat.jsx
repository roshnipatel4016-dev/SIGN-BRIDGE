import { useState, useEffect, useRef } from "react";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "हिंदी", flag: "🇮🇳" },
  { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
  { code: "mr", name: "मराठी", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "తెలుగు", flag: "🇮🇳" },
  { code: "bn", name: "বাংলা", flag: "🇮🇳" },
  { code: "ur", name: "اردو", flag: "🇵🇰" },
];

const responses = {
  en: {
    hello: "Hello sign: Raise your hand and wave! 👋 This is the most basic sign.",
    namaste: "Namaste sign: Join both hands and bow slightly 🙏",
    thankyou: "Thank You sign: Touch your fingers to your lips and move forward 🤝",
    iloveyou: "I Love You sign: Raise thumb, index finger and pinky - this is ILY sign 🤟",
    yes: "Yes sign: Make a fist and nod it up and down ✊",
    no: "No sign: Tap index and middle finger to thumb ✌️",
    a: "Letter A: Close fist, thumb on side ✊",
    b: "Letter B: Keep four fingers straight, tuck thumb 🖐️",
    default: "Interesting question! I can help with sign language. Ask about specific signs like 'Hello', 'Thank You' or any alphabet!"
  },
  hi: {
    hello: "Hello का साइन: अपना हाथ उठाकर हिलाएं! 👋 यह सबसे आसान साइन है।",
    namaste: "नमस्ते का साइन: दोनों हाथ जोड़ें और थोड़ा झुकें 🙏",
    thankyou: "Thank You का साइन: उंगलियां होठों पर लगाएं और आगे ले जाएं 🤝",
    iloveyou: "I Love You का साइन: अंगूठा, तर्जनी और छोटी उंगली उठाएं 🤟",
    yes: "हां का साइन: मुट्ठी बनाएं और ऊपर नीचे हिलाएं ✊",
    no: "नहीं का साइन: तर्जनी और मध्यमा को अंगूठे से मिलाएं ✌️",
    a: "A अक्षर: मुट्ठी बंद करें, अंगूठा साइड में ✊",
    b: "B अक्षर: चारों उंगलियां सीधी रखें, अंगूठा अंदर दबाएं 🖐️",
    default: "दिलचस्प सवाल! मैं साइन लैंग्वेज में मदद कर सकता हूं। कोई खास साइन पूछें जैसे 'Hello', 'Thank You' या कोई अक्षर!"
  },
  gu: {
    hello: "Hello નો સાઈન: તમારો હાથ ઉઠાવો અને હલાવો! 👋 આ સૌથી સરળ સાઈન છે।",
    namaste: "નમસ્તે નો સાઈન: બંને હાથ જોડો અને થોડું નમો 🙏",
    thankyou: "Thank You નો સાઈન: આંગળીઓ હોઠ પર મૂકો અને આગળ લઈ જાઓ 🤝",
    iloveyou: "I Love You નો સાઈન: અંગૂઠો, તર્જની અને નાની આંગળી ઉઠાવો 🤟",
    yes: "હા નો સાઈન: મુઠ્ઠી બનાવો અને ઉપર નીચે હલાવો ✊",
    no: "ના નો સાઈન: તર્જની અને મધ્યમાને અંગૂઠા સાથે મેળવો ✌️",
    a: "A અક્ષર: મુઠ્ઠી બંધ કરો, અંગૂઠો બાજુ પર ✊",
    b: "B અક્ષર: ચારેય આંગળીઓ સીધી રાખો, અંગૂઠો અંદર દબાવો 🖐️",
    default: "રસપ્રદ સવાલ! હું સાઈન લેંગ્વેજ વિશે મદદ કરી શકું છું. કોઈ ખાસ સાઈન પૂછો!"
  },
  mr: {
    hello: "Hello चे साईन: हात वर करून हलवा! 👋 हे सर्वात सोपे साईन आहे।",
    namaste: "नमस्ते चे साईन: दोन्ही हात जोडा आणि थोडे वाका 🙏",
    thankyou: "Thank You चे साईन: बोटे ओठांवर ठेवा आणि पुढे न्या 🤝",
    iloveyou: "I Love You चे साईन: अंगठा, तर्जनी आणि करंगळी वर करा 🤟",
    yes: "हो चे साईन: मुठ बनवा आणि वर खाली हलवा ✊",
    no: "नाही चे साईन: तर्जनी आणि मधली बोट अंगठ्याला लावा ✌️",
    a: "A अक्षर: मुठ बंद करा, अंगठा बाजूला ✊",
    b: "B अक्षर: चारही बोटे सरळ ठेवा, अंगठा आत दाबा 🖐️",
    default: "मनोरंजक प्रश्न! मी साईन लँग्वेजबद्दल मदत करू शकतो. एखादे विशिष्ट साईन विचारा!"
  },
  ta: {
    hello: "Hello அடையாளம்: உங்கள் கையை தூக்கி அசையுங்கள்! 👋",
    namaste: "நமஸ்தே அடையாளம்: இரு கைகளையும் சேர்த்து வணங்குங்கள் 🙏",
    thankyou: "Thank You அடையாளம்: விரல்களை உதட்டில் வைத்து முன்னோக்கி நகர்த்துங்கள் 🤝",
    iloveyou: "I Love You அடையாளம்: கட்டை விரல், ஆள்காட்டி விரல் மற்றும் சின்னவிரல் தூக்குங்கள் 🤟",
    yes: "ஆம் அடையாளம்: மூடிய கையை மேலே கீழே அசையுங்கள் ✊",
    no: "இல்லை அடையாளம்: ஆள்காட்டி விரல் மற்றும் நடு விரலை கட்டை விரலில் தட்டுங்கள் ✌️",
    default: "சுவாரஸ்யமான கேள்வி! நான் சைன் லாங்குவேஜ் பற்றி உதவ முடியும்!"
  },
  te: {
    hello: "Hello సైన్: మీ చేయి పైకెత్తి ఊపండి! 👋",
    namaste: "నమస్తే సైన్: రెండు చేతులూ జోడించి వంగండి 🙏",
    thankyou: "Thank You సైన్: వేళ్ళను పెదాలకు తాకించి ముందుకు తీసుకెళ్ళండి 🤝",
    iloveyou: "I Love You సైన్: బొటన వేలు, చూపుడు వేలు మరియు చిటికెన వేలు పైకెత్తండి 🤟",
    yes: "అవును సైన్: పిడికిలి పైకి కిందికి ఊపండి ✊",
    no: "కాదు సైన్: చూపుడు మరియు మధ్య వేళ్ళను బొటన వేలుకు తాకించండి ✌️",
    default: "ఆసక్తికరమైన ప్రశ్న! నేను సైన్ లాంగ్వేజ్ గురించి సహాయం చేయగలను!"
  },
  bn: {
    hello: "Hello সাইন: আপনার হাত তুলুন এবং নাড়ান! 👋",
    namaste: "নমস্তে সাইন: দুই হাত জোড়া করুন এবং একটু ঝুঁকুন 🙏",
    thankyou: "Thank You সাইন: আঙুল ঠোঁটে লাগান এবং সামনে নিয়ে যান 🤝",
    iloveyou: "I Love You সাইন: বুড়ো আঙুল, তর্জনী এবং কনিষ্ঠ আঙুল তুলুন 🤟",
    yes: "হ্যাঁ সাইন: মুঠো বানান এবং উপরে নিচে নাড়ান ✊",
    no: "না সাইন: তর্জনী এবং মধ্যমা আঙুল বুড়ো আঙুলে লাগান ✌️",
    default: "আগ্রহজনক প্রশ্ন! আমি সাইন ল্যাঙ্গুয়েজ সম্পর্কে সাহায্য করতে পারি!"
  },
  ur: {
    hello: "Hello کا سائن: اپنا ہاتھ اٹھائیں اور ہلائیں! 👋",
    namaste: "نمستے کا سائن: دونوں ہاتھ جوڑیں اور تھوڑا جھکیں 🙏",
    thankyou: "Thank You کا سائن: انگلیاں ہونٹوں پر لگائیں اور آگے لے جائیں 🤝",
    iloveyou: "I Love You کا سائن: انگوٹھا، شہادت کی انگلی اور چھوٹی انگلی اٹھائیں 🤟",
    yes: "ہاں کا سائن: مٹھی بنائیں اور اوپر نیچے ہلائیں ✊",
    no: "نہیں کا سائن: شہادت اور درمیانی انگلی کو انگوٹھے سے ملائیں ✌️",
    default: "دلچسپ سوال! میں سائن لینگویج کے بارے میں مدد کر سکتا ہوں!"
  },
};

export default function Chat({ onBack }) {
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Namaste! 🤟 Main SIGN3 Assistant hun. Apni language chunein aur sign language ke baare mein pucho!", time: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getBotResponse = (text) => {
    const lower = text.toLowerCase();
    const r = responses[lang] || responses.en;
    if (lower.includes("hello") || lower.includes("hi")) return r.hello || r.default;
    if (lower.includes("namaste") || lower.includes("नमस्ते") || lower.includes("નમસ્તે")) return r.namaste || r.default;
    if (lower.includes("thank") || lower.includes("धन्यवाद") || lower.includes("આભાર")) return r.thankyou || r.default;
    if (lower.includes("love") || lower.includes("प्यार") || lower.includes("પ્રેમ")) return r.iloveyou || r.default;
    if (lower.includes("yes") || lower.includes("हां") || lower.includes("હા")) return r.yes || r.default;
    if (lower.includes("no") || lower.includes("नहीं") || lower.includes("ના")) return r.no || r.default;
    if (lower.includes(" a ") || lower === "a") return r.a || r.default;
    if (lower.includes(" b ") || lower === "b") return r.b || r.default;
    return r.default;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), sender: "user", text: input, time: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const botResponse = getBotResponse(input);
      const botMsg = { id: Date.now() + 1, sender: "bot", text: botResponse, time: new Date().toLocaleTimeString() };
      setMessages(prev => [...prev, botMsg]);
      setLoading(false);
      speak(botResponse);
    }, 800);
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text.replace(/[^\w\s\u0900-\u097F\u0A80-\u0AFF\u0C00-\u0C7F]/gi, ""));
    const langMap = { en: "en-US", hi: "hi-IN", gu: "gu-IN", mr: "mr-IN", ta: "ta-IN", te: "te-IN", bn: "bn-IN", ur: "ur-PK" };
    utter.lang = langMap[lang] || "en-US";
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  const quickQuestions = {
    en: ["Hello sign?", "Thank You?", "I Love You?", "Letter A?", "Yes sign?"],
    hi: ["Hello का साइन?", "धन्यवाद?", "I Love You?", "A अक्षर?", "हां का साइन?"],
    gu: ["Hello નો સાઈન?", "આભાર?", "I Love You?", "A અક્ષર?", "હા નો સાઈન?"],
    mr: ["Hello चे साईन?", "धन्यवाद?", "I Love You?", "A अक्षर?", "हो चे साईन?"],
    ta: ["Hello அடையாளம்?", "நன்றி?", "I Love You?", "A எழுத்து?"],
    te: ["Hello సైన్?", "ధన్యవాదాలు?", "I Love You?", "A అక్షరం?"],
    bn: ["Hello সাইন?", "ধন্যবাদ?", "I Love You?", "A অক্ষর?"],
    ur: ["Hello کا سائن?", "شکریہ?", "I Love You?", "A حرف?"],
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <div style={styles.headerInfo}>
          <div style={styles.botAvatar}>🤟</div>
          <div>
            <h1 style={styles.title}>SIGN3 Assistant</h1>
            <p style={styles.online}>● Online</p>
          </div>
        </div>
        {/* Language Selector */}
        <div style={styles.langSelector}>
          {languages.map((l) => (
            <button key={l.code}
              style={{ ...styles.langBtn, ...(lang === l.code ? styles.langActive : {}) }}
              onClick={() => setLang(l.code)}>
              {l.flag} {l.name}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Questions */}
      <div style={styles.quickBar}>
        {(quickQuestions[lang] || quickQuestions.en).map((q, i) => (
          <button key={i} style={styles.quickBtn} onClick={() => setInput(q)}>
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={styles.chatBox}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ ...styles.msgRow, justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
            {msg.sender === "bot" && <div style={styles.botIcon}>🤟</div>}
            <div style={{ ...styles.bubble, ...(msg.sender === "user" ? styles.userBubble : styles.botBubble) }}>
              <p style={styles.msgText}>{msg.text}</p>
              <p style={styles.msgTime}>{msg.time}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.msgRow, justifyContent: "flex-start" }}>
            <div style={styles.botIcon}>🤟</div>
            <div style={styles.botBubble}>
              <p style={styles.msgText}>⏳ Soch raha hun...</p>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={styles.inputBar}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={lang === "hi" ? "साइन लैंग्वेज के बारे में पूछें..." : lang === "gu" ? "સાઈન લેંગ્વેજ વિશે પૂછો..." : "Sign language ke baare mein pucho..."}
        />
        <button style={styles.sendBtn} onClick={sendMessage}>Send 📤</button>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", flexDirection: "column", height: "100vh", background: "#0f0f1a", fontFamily: "'Segoe UI', sans-serif" },
  header: { display: "flex", alignItems: "center", gap: "16px", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", flexWrap: "wrap" },
  backBtn: { padding: "10px 20px", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "0.9rem" },
  headerInfo: { display: "flex", alignItems: "center", gap: "12px" },
  botAvatar: { width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg, #6c63ff, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" },
  title: { color: "#fff", fontSize: "1.2rem", fontWeight: "700", margin: 0 },
  online: { color: "#10b981", fontSize: "0.8rem", margin: 0 },
  langSelector: { display: "flex", gap: "6px", flexWrap: "wrap", marginLeft: "auto" },
  langBtn: { padding: "6px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.75rem", fontWeight: "500" },
  langActive: { background: "rgba(108,99,255,0.3)", border: "1px solid #6c63ff", color: "#fff" },
  quickBar: { display: "flex", gap: "8px", padding: "12px 24px", overflowX: "auto", borderBottom: "1px solid rgba(255,255,255,0.08)" },
  quickBtn: { padding: "6px 14px", background: "rgba(108,99,255,0.15)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: "20px", color: "#a78bfa", cursor: "pointer", fontSize: "0.8rem", whiteSpace: "nowrap", fontWeight: "500" },
  chatBox: { flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" },
  msgRow: { display: "flex", alignItems: "flex-end", gap: "8px" },
  botIcon: { width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #6c63ff, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 },
  bubble: { maxWidth: "70%", padding: "12px 16px", borderRadius: "16px" },
  botBubble: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderBottomLeftRadius: "4px" },
  userBubble: { background: "linear-gradient(135deg, #6c63ff, #3b82f6)", borderBottomRightRadius: "4px" },
  msgText: { color: "#fff", fontSize: "0.95rem", margin: 0, lineHeight: "1.5", whiteSpace: "pre-line" },
  msgTime: { color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", marginTop: "4px", marginBottom: 0 },
  inputBar: { display: "flex", gap: "12px", padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" },
  input: { flex: 1, padding: "14px 18px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: "0.95rem", outline: "none" },
  sendBtn: { padding: "14px 24px", background: "linear-gradient(135deg, #6c63ff, #3b82f6)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "0.95rem", fontWeight: "700", cursor: "pointer" },
};