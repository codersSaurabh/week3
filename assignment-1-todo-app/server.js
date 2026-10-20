const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your_jwt_secret_key';

app.use(cors());
app.use(express.json());

// In-Memory Data Stores
const users = [];
let todos = [];

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  users.push({ username, password });
  res.status(201).json({ message: 'User created successfully' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// To-Do CRUD Routes
app.get('/api/todos', authenticateToken, (req, res) => {
  const userTodos = todos.filter(t => t.username === req.user.username);
  res.json(userTodos);
});

app.post('/api/todos', authenticateToken, (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const newTodo = {
    id: Date.now(),
    username: req.user.username,
    title,
    completed: false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put('/api/todos/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const todo = todos.find(t => t.id == id && t.username === req.user.username);
  if (!todo) return res.status(404).json({ message: 'Todo not found' });

  if (req.body.completed !== undefined) todo.completed = req.body.completed;
  if (req.body.title !== undefined) todo.title = req.body.title;

  res.json(todo);
});

app.delete('/api/todos/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  todos = todos.filter(t => !(t.id == id && t.username === req.user.username));
  res.json({ message: 'Todo deleted successfully' });
});

app.listen(PORT, () => console.log(`To-Do Backend running on http://localhost:${PORT}`));
