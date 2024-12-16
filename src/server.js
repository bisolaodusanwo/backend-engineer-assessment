const app = require("./app");
const connectDB = require("./config/database");
const dotenv = require("dotenv");

dotenv.config();

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
