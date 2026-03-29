const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const phonesRouter = require("./routes/phones");
const compareRouter = require("./routes/compare");

dotenv.config({ path: "../.env" });

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/phones", phonesRouter);
app.use("/api/compare", compareRouter);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));