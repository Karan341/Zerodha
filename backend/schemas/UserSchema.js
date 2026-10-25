const { Schema } = require("mongoose");

const UserSchema = new Schema({
  name: String,
  email: {
  type: String,
  required: true,
  unique: true
  },   
  password: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = { UserSchema };