const Messages = require("../models/messagesModel.js");

const addMessage = async (socket, data) => {
  try {
    const message = await Messages.create({
      chatId: data.chatId,
      sender: socket.headers.email,
      message: data.message,
      time: new Date().toISOString(),
      status: "unread",
    });
    return { status: true, message, msg: "Message saved successfullt" };
  } catch (err) {
    return { status: false, error: "Internal server error" };
  }
};

const getMessages = async (socket, data) => {
  try {
    const messages = await Messages.find({ chatId: data });
    return { status: true, messages };
  } catch (err) {
    return { status: false, error: "Internal server error" };
  }
};

module.exports = { addMessage, getMessages };
