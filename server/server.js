const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const SingleOrder = require('./model/SingleOrder'); // ✅ import model

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ DB error:', err));

// Test Route
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

// ✅ Route to handle order saving
app.post('/api/single-order', async (req, res) => {
  const {
    productName,
    description,
    price,
    quantity,
    imageUrl,
    category,
    buyerEmail
  } = req.body;

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
    console.error("❌ Failed to save order:", err);
    res.status(500).json({ message: "❌ Server error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
