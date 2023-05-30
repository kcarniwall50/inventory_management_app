const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/Route");
const ProductRoute = require("./routes/ProductRoute");
const contactRoute = require("./routes/contactUsRoute");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

mongoose.set("strictQuery", false);

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  cors({
<<<<<<< HEAD
    origin: ["http://localhost:3000", "https://inventory-app.vercel.app"],
=======
    origin: ["http://localhost:3000", "https://inventory-app-six-livid.vercel.app"],
>>>>>>> ffcd8dc06563971bf6f1096f305378e7bc147cfd
    credentials: true,
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// route middlewares
app.use(router);
app.use(ProductRoute);
app.use(contactRoute);

// logging
if (process.env.NODE_ENV !== "production") {
  console.log = function () {};
}

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(
    app.listen(PORT, () => {
      console.log(`server is active on port ${PORT}...`);
    })
  )
  .catch((error) => {
    console.log("error: ", error.message);
  });
