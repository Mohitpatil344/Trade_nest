const express = require("express");
const cors = require("cors");
const path = require('path');
const mongoose = require("mongoose");
require("dotenv").config();
const multer = require('multer');
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoutes");
const messageRoute = require("./Routes/messageRoutes");

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});
const upload = multer({ storage: storage });

const Product = mongoose.model('Product', {
  description: String,
  price: String,
  image: String
});

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to TradeNest");
});

// Add product route
app.post("/add-product", upload.single('image'), (req, res) => {
  console.log("Received request to add product", req.body);
  console.log("Uploaded file:", req.file);

  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }
  
  const description = req.body.description;
  const price = req.body.price;
  const image = req.file.path; // Get the image path from the uploaded file

  const product = new Product({ description, price, image });

  product.save()
    .then(() => {
      res.send({ message: 'Product saved successfully' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: 'Server error' });
    });
});

// Get products route
app.get('/get-product', (req, res) => {
  Product.find()
    .then((result) => {
      console.log(result, "product data");
      res.send({ message: 'Success', products: result });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: 'Server error' });
    });
});

// User routes
app.use("/api/users", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/messages", messageRoute);
// MongoDB connection
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established"))
  .catch((error) => console.log("MongoDB connection failed", error.message));

// Start server
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
