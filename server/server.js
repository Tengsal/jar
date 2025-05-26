require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const SingleOrder = require('./model/SingleOrder');
const User = require('./model/user');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ DB error:', err.message));

// Base route
app.get('/', (req, res) => res.send('Hello from backend!'));

// Signup
app.post('/signup', async (req, res) => {
  const { fullname, email, username, password } = req.body;
  try {
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ fullname, email, username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Signup Error:', err);
    res.status(500).json({ message: 'Server error during signup', error: err.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email }, { username: email }],
      password
    });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful', user: { username: user.username, email: user.email } });
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

// Save single order
app.post('/api/single-order', async (req, res) => {
  const { productName, description, price, quantity, imageUrl, category, buyerEmail } = req.body;
  try {
    const total = price * quantity;
    const newOrder = new SingleOrder({
      productName,
      description,
      price,
      quantity,
      total,
      imageUrl,
      category,
      buyerEmail
    });
    await newOrder.save();
    res.status(201).json({ message: "✅ Order saved", orderId: newOrder._id });
  } catch (err) {
    console.error('❌ Order Error:', err);
    res.status(500).json({ message: "❌ Server error during order saving", error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
