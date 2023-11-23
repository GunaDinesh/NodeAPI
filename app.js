const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/productModel");
const app = express();

const corsOptions = {
  origin: "http://localhost:4200",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200,
};

var cors = require("cors");
app.use(cors(corsOptions));
app.options("*", cors());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.get("/api", (req, res) => {
  res.send("Hello Node API");
});

// add product
app.post("/api/product", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// retrieve all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// retrieve specific product
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update product
app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    if (!product) {
      return res
        .status(404)
        .json({ message: `cannot find any product with ID ${id}` });
    }
    const updatedProduct = await Product.findById(id);

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: `cannot find any product with ID ${id}` });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

mongoose
  .connect(
    "mongodb+srv://admin:admin@nodeapi.4ynvklg.mongodb.net/Node-API?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3002, () => {
      console.log("App running on port 3002");
    });
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.log("Connection failed");
  });
