const mongoose = require('mongoose');

const stockItemSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  barcode:       { type: String, trim: true },
  category:      { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  supplier:      { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  price:         { type: Number, required: true },
  cost:          { type: Number, required: true },
  quantity:      { type: Number, required: true },
  minStockLevel: { type: Number, default: 5 },
  expiryDate:    { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('StockItem', stockItemSchema);
