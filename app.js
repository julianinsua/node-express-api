const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const { diskStorage } = require("multer");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const isAuth = require("./src/middleware/isAuth");
const graphqlResolver = require("./src/graphql/resolvers");
const graphqlSchema = require("./src/graphql/schema");
const clearImage = require("./src/util/clearImage");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

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

// Fixing CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// AUTHENTICATION MIDDLEWARE
app.use(isAuth);

// IMAGE UPLOAD MIDDLEWARE
app.put("/post-image", (req, res, next) => {
  if (!req.isAuth) {
    throw new Error("Not Authenticated");
  }
  if (!req.file) {
    return res.status(200).json({ message: "No file provided" });
  }
  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }
  return res.status(201).json({ message: "file stored", path: req.file.path });
});

// GRAPHQL MIDDLEWARE
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(e) {
      if (!e.originalError) {
        return e;
      }
      const data = e.originalError.data;
      const message = e.message || "Something went wrong!";
      const code = e.originalError.code;
      return { message, data, code };
    },
  })
);

// ERROR HANDLING
app.use((error, req, res, next) => {
  const { statusCode = 500, message, data } = error;
  res.status(statusCode).json({ message, data });
});

mongoose
  .connect(process.env.API_URL)
  .then((result) => {
    app.listen(8080);
  })
  .catch((e) => console.log(e));
