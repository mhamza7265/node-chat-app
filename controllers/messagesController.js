const Messages = require("../models/messagesModel.js");

const addMessage = async (req, res) => {
  try {
    const message = await Messages.create({
      chatId: req.body.chatId,
      sender: req.headers.email,
      message: req.body.message,
      time: new Date().toISOString(),
      status: "unread",
    });
    return res.status(200).json({ status: true, message });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Messages.find({ chatId: req.params.chatId });
    return res.status(200).json({ status: true, messages });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
  }
};

module.exports = { addMessage, getMessages };
