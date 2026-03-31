const express = require("express");
const router = express.Router();
const Phone = require("../models/Phone");
const axios = require("axios");

async function getOrScrapePhone(name) {
  try {
    // exact match only
    let existing = await Phone.findOne({ 
      name: { $regex: `^${name}$`, $options: "i" }
    })

    if (existing) return existing

    // call scraper to get the correct full name and URL
    const scrapeResponse = await axios.post("http://localhost:8000/scrape", {
      phone_name: name
    })

    if (scrapeResponse.data.error) return null

    // use the exact name returned by scraper for lookup
    return await Phone.findOne({ 
      name: { $regex: `^${scrapeResponse.data.name}$`, $options: "i" }
    })
  } catch (err) {
    return null
  }
}

router.post("/", async (req, res) => {
  try {
    const { phones, user_preference } = req.body;

    if (!phones || phones.length !== 2) {
      return res.status(400).json({
        error: "Please provide exactly two phone names"
      });
    }

    const results = await Promise.all(
      phones.map(name => getOrScrapePhone(name))
    );

    if (!results[0] || !results[1]) {
      return res.status(404).json({
        error: "One or both phones not found"
      });
    }

    const analysisResponse = await axios.post(
      "http://localhost:8000/analyse",
      {
        phone1: JSON.parse(JSON.stringify(results[0])),
        phone2: JSON.parse(JSON.stringify(results[1])),
        user_preference: user_preference || "general use"
      }
    );

    res.json({
      phone1: results[0],
      phone2: results[1],
      scores: analysisResponse.data.scores,
      verdict: analysisResponse.data.verdict
    });

  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: "Analysis service is unavailable. Please try again later." 
      })
    }
    res.status(500).json({ error: err.message })
  }

});

module.exports = router;