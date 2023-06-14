const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({

    email: {
      type: String,
      required: [true, "Please add email"],
      unique: [true, "Email address already taken"],
      lowercase: true,
    },
  
    password: {
      type: String,
      required: [true, "Please add password"],
    },
  
    name: {
      type: String,
      required: [true, "Please add full name"],
    },
  
    contact: {
      type: String,
      required: [true, "Please add contact number"],
    },
  
    aadhar: {
      type: String,
      required: [true, "Please add aadhar number"],
    },
  
    address: {
      type: String,
      required: [true, "Please add address"],
    },
  
    pincode: {
      type: String,
      required: [true, "Please add pincode"],
    },
  
    city: {
      type: String,
      required: [true, "Please add city"],
    },
});

module.exports = mongoose.model("Customer", customerSchema);