const mongoose = require("mongoose");
const Employee = require("../models/user.model");
const Customer = require("../models/customer.model");
const Product = require("../models/productModel");

const orderSchema = mongoose.Schema({
    productID: {
        type: String,
        required: [true, "Please add product ID"],
      },
    
      customerEmail: {
        type: String,
        required: [true, "Please add customerEmail"],
      },
    
      employeeEmail: {
        type: String,
        required: [true, "Please add employee Email"],
      }
})

module.exports = mongoose.model("Order", orderSchema);