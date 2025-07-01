const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  date: { type: Date, default: Date.now },
  km: { type: Number, required: true },
  serviceCost: { type: Number, required: true, min: 0 },
  sparePartsUsed: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory" },
    quantity: { type: Number, min: 1 },
    unitPrice: { type: Number, min: 0 },
  }],
  description: { type: String, required: true },
});

module.exports = mongoose.model("Service", serviceSchema);