  const express = require("express");
  const cors = require("cors");
  const path = require('path');
  const mongoose = require("mongoose");
  require("dotenv").config();
  const multer = require('multer');
  const userRoute = require("./Routes/userRoute");

  const app = express();
  const port = process.env.PORT || 5000;
  const uri = process.env.ATLAS_URI;

  app.use(express.json());
  app.use(cors());

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  });

  const upload = multer({ storage: storage });
  const bodyparser = require('body-parser')
  app.use('/uploads',express.static(path.join(__dirname,'uploads')));

  //prodcut model  

  const Product = mongoose.model('Product', {
    description: String,
    price: String,
    image: String
  });

  app.get("/", (req, res) => {
    res.send("Welcome to TradeNest");
  });

  app.post("/add-product", upload.single('image'), (req, res) => {
    console.log(req.body);
    console.log(req.file.path);

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

  // app.get('/search-product', (req, res) => {
  //   console.log(req.query.name, "search query"); // Add this line to check if the query is being received
  //   const query = req.query.name;

  //   if (!query) {
  //     return res.status(400).send({ message: 'No search query provided' });
  //   }

  //   Product.find({ description: { $regex: query, $options: 'i' } })
  //     .then((result) => {
  //       console.log(result, "search result");  // Check this console log for the fetched products
  //       res.send({ message: 'Success', products: result });
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       res.status(500).send({ message: 'Server error' });
  //     });
  // });


  app.use("/api/users", userRoute);

  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connection established"))
    .catch((error) => console.log("MongoDB connection failed", error.message));

  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
