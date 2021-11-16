const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please prove a name"],
    minLenght: 3,
    maxLength: 20,
  },
  email: {
    type: String,
    required: [true, "please prove a name"],
    minLenght: 3,
    maxLength: 50,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  refreshToken: {
    type: String,
    required: false,
  },
})

UserSchema.methods.createJWT = function () {
  return jwt.sign({ id: this._id, name: this.name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
}

UserSchema.methods.createRefreshJWT = function () {
  return jwt.sign(
    { id: this._id, name: this.name },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_LIFETIME }
  )
}

UserSchema.methods.checkPassword = async function (pass) {
  const matched = await bcrypt.compare(pass, this.password)
  return matched
}

module.exports = mongoose.model("User", UserSchema)
