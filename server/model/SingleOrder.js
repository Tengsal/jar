const mongoose = require('mongoose');

const SingleOrderSchema = new mongoose.Schema({
  productName: String,
  description: String,
  price: Number,
  quantity: Number,
  total: Number,
  imageUrl: String,
  category: String,
  buyerEmail: String,
  orderDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SingleOrder', SingleOrderSchema);
