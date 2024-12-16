const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ type: "*/*" }));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
