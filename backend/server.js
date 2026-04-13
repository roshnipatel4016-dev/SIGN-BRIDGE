const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const users = [];
const progressData = [];
const lessons = [
  { _id: "1", title: "A Se Anar", description: "Basic alphabets seekho", category: "Alphabets", difficulty: "beginner" },
  { _id: "2", title: "Hello Kaise Bolein", description: "Greetings sign language mein", category: "Greetings", difficulty: "beginner" },
  { _id: "3", title: "Numbers 1-10", description: "1 se 10 tak numbers", category: "Numbers", difficulty: "beginner" },
  { _id: "4", title: "Family Members", description: "Parivar ke members", category: "Family", difficulty: "intermediate" },
  { _id: "5", title: "Colors", description: "Rang seekho sign mein", category: "Colors", difficulty: "intermediate" },
  { _id: "6", title: "Days of Week", description: "Saptah ke din", category: "General", difficulty: "advanced" },
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
app.listen(5000, () => console.log('Server running on port 5000 ✅'));