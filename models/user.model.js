const mongoose = require("mongoose");
const createHttpError = require("http-errors");
const bcrypt = require("bcrypt");
const { roles } = require("../utils/constants");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [roles.admin, roles.head, roles.emp],
    default: roles.emp,
    // required: true,
  },
});
userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw createHttpError.InternalServerError(error.message);
  }
};

module.exports = mongoose.model("user", userSchema);
