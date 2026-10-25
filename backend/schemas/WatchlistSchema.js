const { Schema } = require("mongoose");

const WatchlistSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  symbols: {
    type: [String],
    default: [],
  },
});

module.exports = { WatchlistSchema };
