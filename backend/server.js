const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: [
    "https://roshnipatel4016-dev.github.io",
    "http://localhost:3000"
  ],
  credentials: true
}));

app.use(express.json());

const users = [];
const progressData = [];
const lessons = [
  { _id: "num-1", title: "Numbers 1 to 5", description: "ISL mein 1 se 5 tak numbers sikhein", category: "Numbers", difficulty: "Beginner" },
  { _id: "num-2", title: "Numbers 6 to 10", description: "ISL mein 6 se 10 tak numbers sikhein", category: "Numbers", difficulty: "Beginner" },
  { _id: "num-3", title: "Numbers 11 to 20", description: "ISL mein 11 se 20 tak numbers sikhein", category: "Numbers", difficulty: "Beginner" },
  { _id: "phrase-1", title: "Greetings - Namaste & Hello", description: "Roz ki zindagi mein kaam aane wale basic greetings", category: "Daily Phrases", difficulty: "Beginner" },
  { _id: "phrase-2", title: "Introducing Yourself", description: "Apna naam aur parichay dene ke ISL signs", category: "Daily Phrases", difficulty: "Beginner" },
  { _id: "phrase-3", title: "Yes, No & Questions", description: "Haan, Naa aur basic sawalon ke signs", category: "Daily Phrases", difficulty: "Beginner" },
  { _id: "phrase-4", title: "Food & Eating", description: "Khaane-peene se related roz ke phrases", category: "Daily Phrases", difficulty: "Intermediate" },
  { _id: "emo-1", title: "Basic Emotions", description: "Khushi, dukh, gussa - basic feelings ke signs", category: "Emotions", difficulty: "Beginner" },
  { _id: "emo-2", title: "More Feelings", description: "Aur zyada feelings aur emotions ke signs", category: "Emotions", difficulty: "Intermediate" },
  { _id: "color-1", title: "Basic Colors", description: "Laal, Neela, Hara - rangon ke ISL signs", category: "Colors", difficulty: "Beginner" },
  { _id: "color-2", title: "More Colors", description: "Orange, Purple, Pink ke ISL signs", category: "Colors", difficulty: "Beginner" },
  { _id: "fam-1", title: "Immediate Family", description: "Maa, Papa, Bhai, Behen - parivaar ke signs", category: "Family", difficulty: "Beginner" },
  { _id: "fam-2", title: "Extended Family", description: "Dada, Nana, Chacha - baaki parivaar ke signs", category: "Family", difficulty: "Intermediate" },
  { _id: "emg-1", title: "Emergency - Help & Safety", description: "Zaruri signs jo emergency mein kaam aate hain", category: "Emergency Signs", difficulty: "Beginner" },
  { _id: "emg-2", title: "Emergency - Medical", description: "Medical emergency mein kaam aane wale signs", category: "Emergency Signs", difficulty: "Intermediate" },
  { _id: "emg-3", title: "Emergency - Directions", description: "Kho jaane ya madad maangne ke liye directions", category: "Emergency Signs", difficulty: "Beginner" },
];

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  const exists = users.find(u => u.email === email);
  if (exists) return res.status(400).json({ message: 'User already exists' });
  users.push({ _id: Date.now().toString(), name, email, password });
  res.json({ message: 'Registration successful!' });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  res.json({ message: 'Login successful!', user, token: 'token_' + user._id });
});

app.get('/api/lessons', (req, res) => { res.json(lessons); });

app.post('/api/progress', (req, res) => {
  const { lessonId, score, completed } = req.body;
  const existing = progressData.find(p => p.lesson === lessonId);
  if (existing) { existing.score = score; existing.completed = completed; existing.attempts += 1; }
  else { progressData.push({ _id: Date.now().toString(), lesson: lessonId, score, completed, attempts: 1 }); }
  res.json({ message: 'Progress saved!' });
});

app.get('/api/progress', (req, res) => {
  const populated = progressData.map(p => ({ ...p, lesson: lessons.find(l => l._id === p.lesson) || { title: "Lesson", category: "General" } }));
  res.json(populated);
});

app.get('/api/progress/stats', (req, res) => {
  const total = progressData.length;
  const completed = progressData.filter(p => p.completed).length;
  const avgScore = total > 0 ? Math.round(progressData.reduce((a, b) => a + b.score, 0) / total) : 0;
  res.json({ totalAttempted: total, totalCompleted: completed, averageScore: avgScore });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`));