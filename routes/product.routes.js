const User = require("../models/user.model");
const Product = require("../models/productModel");
const express = require("express");
const router = express.Router();

// PRODUCT GET ROUTES
router.get("/", async (req, res) => {
  const products = await Product.find({});

  // SHOW ALL PRODUCTS
  res.render("product", { products });
});

router.get("/new", async (req, res) => {
  // CREATE A PRODUCT PAGE
  // res.render("products")
  res.render("newProduct");
});

// PRODUCT POST ROUTES

router.post("/new", async (req, res) => {
  console.log(req.body);
  const { name, validity, price, ppt } = req.body;

  const product = Product.create({
    name,
    validity,
    price,
    ppt,
  });

  res.redirect("/product");
});

module.exports = router;
