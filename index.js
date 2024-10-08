const connectDb = require("./config/dbConnection");
const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv").config();

const app = express();
let indexRouter = require("./routes/index.route");
app.use(cors());
const port = process.env.PORT || 5000;
connectDb();

app.use(express.json());
app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
