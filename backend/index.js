// backend/index.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const POSTS_FILE = path.join(__dirname, 'posts.json');

app.use(express.static("public"));
app.use(cors());
app.use(express.json());

// 初期ファイルがなければ作成
if (!fs.existsSync(POSTS_FILE)) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify([]));
}

// POST /api/post
app.post('/api/post', (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message' });
  }

  const posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
  posts.unshift(message.trim());
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts.slice(0, 1000), null, 2));
  res.status(201).json({ success: true });
});

// GET /api/posts
app.get('/api/posts', (req, res) => {
  const posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
  const count = posts.length;
  const shuffled = posts.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 10);
  res.json({ posts: selected, count });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
