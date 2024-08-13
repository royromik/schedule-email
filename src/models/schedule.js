const mongoose = require("mongoose");
const validator = require("validator");

const scheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("email is invalid");
      }
    },
  },
  description: {
    type: String,
    default: "Hi, This is an automated email",
  },
});

const Schedules = mongoose.model("Schedules", scheduleSchema);

module.exports = Schedules;
