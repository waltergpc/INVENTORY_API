const User = require("../models/User")
const { StatusCodes, PERMANENT_REDIRECT } = require("http-status-codes")
const { BadRequestError, UnauthenticatedError } = require("../errors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const register = async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    throw new BadRequestError("Please provide name, email and password")
  }
  if (password.length < 8) {
    throw new BadRequestError("Password should be at least 8 characters")
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const tempUser = { name, email, password: hashedPassword }

  const user = await User.create({ ...tempUser })
  const token = user.createJWT()
  const refreshToken = user.createRefreshJWT()
  res.cookie("refreshtoken", refreshToken, {
    httpOnly: true,
    path: "auth/token",
  })
  res.status(StatusCodes.CREATED).json({ user: { token, name: user.name } })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password")
  }
  const user = await User.findOne({ email })

  if (!user) {
    throw new UnauthenticatedError("Invalid credentials")
  }

  const correctPassword = await user.checkPassword(password)
  if (!correctPassword) {
    throw new UnauthenticatedError("Invalid credentials")
  }

  const token = user.createJWT()
  const refreshToken = user.createRefreshJWT()
  res.cookie("refreshtoken", refreshToken, {
    httpOnly: true,
    path: "auth/token",
  })
  res.status(StatusCodes.OK).json({ user: { user: user.name, token } })
}

const token = async (req, res) => {
  const token = req.cookies.refreshtoken
  console.log(req.cookies.refreshtoken)
  if (!token) {
    return res.send("Please provide credentials")
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    const { name, id } = payload
    const user = await User.findOne({ _id: id })
    console.log(user)
    if (!user) {
      throw new BadRequestError("User not found, please provide credentials")
    }
    const newToken = user.createJWT()
    const refreshToken = user.createRefreshJWT()
    user.refreshToken = refreshToken
    user.save()
    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      path: "auth/token",
    })
    res.status(StatusCodes.OK).json({ token: newToken, name: user.name })
  } catch (err) {
    throw new UnauthenticatedError("Authentication invalid, please login")
  }
}

module.exports = {
  register,
  login,
  token,
}
