const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    }, 
    role: {
      type: String,
      enum: ['internal', 'admin'],
      required: true,
      default: 'internal'
    },
    confirmed: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
