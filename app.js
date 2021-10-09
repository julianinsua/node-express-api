const path = require("path");
const express = require("express");
const { createServer } = require("http");
const { init } = require("./socket");
const bodyParser = require("body-parser");
const multer = require("multer");
const { diskStorage } = require("multer");
const mongoose = require("mongoose");
const feedRoutes = require("./src/routes/feedRoutes");
const authRoutes = require("./src/routes/authRoutes");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const httpServer = createServer(app);
// this is the part that should go into a different file and export io
const io = init(httpServer);

io.on("connection", (socket) => {
  console.log("Client connected");
});

// PARSERS
const fileStorage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use(bodyParser.json());

// SERVING STATIC IMAGES
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});

// ROUTES
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

// ERROR HANDLING
app.use((error, req, res, next) => {
  const { statusCode = 500, message, data } = error;
  res.status(statusCode).json({ message, data });
});

mongoose
  .connect(process.env.API_URL)
  .then((result) => {
    httpServer.listen(8080);
  })
  .catch((e) => console.log(e));
