const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const app = express(); // Initialize express app

// Middleware
app.use(cors());
app.use(express.json());

// Log incoming requests (optional but useful)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');

app.use('/api/auth', authRoutes);         // register, login, mfa-verify
app.use('/api/expenses', expenseRoutes);  // expense operations

// Health check route
app.get('/', (req, res) => res.send('API Running'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
