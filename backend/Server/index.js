const express = require("express");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/admin");
const cors = require("cors");

const corsOptions = {
  origin: "*", // Replace with your front-end URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // HTTP methods allowed
  credentials: true, // Enable credentials (cookies, authentication headers, etc.)
  optionsSuccessStatus: 204, // Response status for preflight requests
};

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

//cors config
app.use(cors(corsOptions));

// Define Routes
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
