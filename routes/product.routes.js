const User = require("../models/user.model");
const Product = require("../models/productModel");
const express = require("express");
const router = express.Router();

// PRODUCT GET ROUTES
router.get("/", async (req,res) => {
    const product = await Product.find({});
  
    // SHOW ALL PRODUCTS 
    res.send(product);
})

router.get("/new", async (req,res) => {

    // CREATE A PRODUCT PAGE 
    // res.render("products")
    res.send("Create a new product page");
})

// PRODUCT POST ROUTES

router.post('/new', async (req, res) => {
    const {name, validity, price, ppt} = req.body;
    
    const product = Product.create({
        name,
        validity,
        price,
        ppt
    });

    res.send(product);
})

module.exports = router;
  