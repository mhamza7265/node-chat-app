const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const Messages = mongoose.model("Messages", messagesSchema);

module.exports = Messages;
