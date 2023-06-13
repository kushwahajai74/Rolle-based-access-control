const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add product name."],
  },

  validity: {
    type: String,
    required: [true, "Please add validity period."],
  },

  price: {
    type: Number,
    required: [true, "Please add product price."],
  },

  ppt: {
    type: String,
    required: [true, "Please add product PPT."],
  },
});

module.exports = new mongoose.model("Product", productSchema);
