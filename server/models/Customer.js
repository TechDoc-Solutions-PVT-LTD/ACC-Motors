const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  vehicleRegNo: { type: String, required: true, unique: true },
  vehicleModel: { type: String, required: true },
  engineNo: { type: String, required: true },
  frameNo: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Customer", customerSchema);