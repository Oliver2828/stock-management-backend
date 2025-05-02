const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  contact: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);
