const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const createHttpError = require("http-errors");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: {
    type: String, required: true
  },
  lastname: {
    type: String, required: true
  },
  uid: {
    type: Number, required: true, unique: true, min: 1000000, max: 9999999
  },
  email: {
    type: String, required: true, lowercase: true, unique: true,
    match: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  },
  password: {
    type: String, required: true, minlength: 8,
    select: false
  },
  role: {
    type: String, required: true,
    default: "student"
  }
}, { timestamps: true });

// Encrypting user passwords before storing...
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(this.password, salt);
    this.password = hashedPwd;
    next();
  } catch (error) {
    console.log(error.message);
    next(createHttpError.InternalServerError());
  }
});

// Helper for validating user passwords...
userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
}

const User = mongoose.model("User", userSchema);
module.exports = User;
