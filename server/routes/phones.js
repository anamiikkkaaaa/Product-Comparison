const express = require("express");
const router = express.Router();
const Phone = require("../models/Phone");

router.get("/", async (req, res) => {
  try {
    const phones = await Phone.find({}, { name: 1 });
    res.json(phones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:name", async (req, res) => {
  try {
    const phone = await Phone.findOne({ 
      name: new RegExp(req.params.name, "i") 
    });
    if (!phone) {
      return res.status(404).json({ error: "Phone not found" });
    }
    res.json(phone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
