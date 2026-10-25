const {Schema} = require("mongoose");

const HoldingsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  name: String,
    qty: Number,
    avg: Number,
    price: Number,
    net: String,
    day: String,
    isDemo: {
      type: Boolean,
      default: false,
    },
})

module.exports = {HoldingsSchema};