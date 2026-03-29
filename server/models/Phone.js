const mongoose = require("mongoose");

const phoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  specs: {
    type: Map,
    of: new mongoose.Schema({}, { strict: false })
  }
}, { timestamps: true });

module.exports = mongoose.model("Phone", phoneSchema);