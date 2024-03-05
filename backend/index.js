const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoute = require("./Routes/userRoute");
const cors = require("cors");


dotenv.config();
connectDB();

const app = express();
app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
  res.send("api started");
});

app.use("/api/user", userRoute);


const PORT = process.env.PORT || 5005;

const server = app.listen(PORT, () => {
  console.log("Server started");
});


