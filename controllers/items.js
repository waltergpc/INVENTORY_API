const Item = require("../models/Item")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, NotFoundError } = require("../errors")

const getAllItems = async (req, res) => {
  const items = await Item.find({
    createdBy: req.user.id,
    generalInput: false,
    missing: false,
  }).sort("createdAt")
  const commonItems = await Item.find({
    generalInput: true,
    missing: false,
    createdBy: req.user.id,
  }).sort("createdAt")
  const missingitems = await Item.find({
    createdBy: req.user.id,
    generalInput: false,
    missing: true,
  }).sort("createdAt")
  const commonMissing = await Item.find({
    generalInput: true,
    missing: true,
    createdBy: req.user.id,
  }).sort("createdAt")
  res.status(StatusCodes.OK).json({
    ownItems: [...items],
    commonItems: [...commonItems],
    ownMissing: [...missingitems],
    commonMissing: [...commonMissing],
  })
}

const getItem = async (req, res) => {
  const {
    user: { id },
    params: { id: itemId },
  } = req
  const item = await Item.findOne({ _id: itemId, createdBy: id })
  if (!item) {
    throw new NotFoundError("item not found")
  }
  res.status(StatusCodes.OK).json({ item })
}

const createItem = async (req, res) => {
  req.body.createdBy = req.user.id
  req.body.quantity = Number(req.body.quantity)
  const item = await Item.create(req.body)
  res.status(StatusCodes.CREATED).json({ item })
}

const updateItem = async (req, res) => {
  console.log(req.body)
  const {
    body: { name, brand, generalInput, quantity },
    user: { id },
    params: { id: itemId },
  } = req

  if (name === "") {
    throw new BadRequestError("Name cannot be empty")
  }
  const filter = { _id: itemId, createdBy: id }
  const update = req.body
  const item = await Item.findOneAndUpdate(filter, update, {
    new: true,
    runValidators: true,
  })
  res.status(StatusCodes.CREATED).json({ item })
}

const deleteItem = async (req, res) => {
  const {
    user: { id },
    params: { id: itemId },
  } = req

  const item = await Item.findOneAndRemove({ _id: itemId, createdBy: id })
  if (!item) {
    throw new NotFoundError("item not found")
  }
  res.status(StatusCodes.ACCEPTED).json({ item })
}

module.exports = {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
}
