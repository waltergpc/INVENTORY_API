const User = require("../models/User")
const jwt = require("jsonwebtoken")
const { UnauthenticatedError } = require("../errors")
const { StatusCodes } = require("http-status-codes")

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Implement redirect to login when ready and check for refresh token
    return res.status(401).json({ msg: "No auth" })
  }

  try {
    const token = authHeader.split(" ")[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: payload.id, name: payload.name }

    if (!payload) {
      throw new UnauthenticatedError("Authentication Invalid, please login")
    }
    req.user = { id: payload.id, name: payload.name }
    next()
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid, please login")
  }
}

module.exports = authMiddleware
