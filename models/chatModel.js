const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const chatSchema = new mongoose.Schema({
  users: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

chatSchema.plugin(mongoosePaginate);
const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
