const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { 
    type: String,
    unique: true,
    required: true 
  },
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Customer", 
    required: true },
  service: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Service", 
    required: true },
  totalAmount: { 
    type: Number, 
    required: true, 
    min: 0 },
  discount: { 
    type: Number, 
    default: 0, 
    min: 0 },
  netAmount: { 
    type: Number, 
    required: true, 
    min: 0 },
  issuedAt: { 
    type: Date, 
    default: Date.now },
  status: { 
    type: String, 
    enum: ["pending", "paid"], 
    default: "pending" },
});

module.exports = mongoose.model("Invoice", invoiceSchema);