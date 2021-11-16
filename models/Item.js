const mongoose = require("mongoose")

const ItemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide an item name"],
      maxLength: 20,
    },
    brand: {
      type: String,
      required: [false, "Please provide a desired or most used brand"],
      maxLength: 20,
    },
    generalInput: {
      type: Boolean,
      required: [true, "Provide if it`s for personal use or whole staff usage"],
      default: false,
    },
    quantity: {
      type: Number,
      required: [false, "Number of in stock items"],
      default: 1,
    },
    missing: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Plase provide a user"],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Item", ItemSchema)
