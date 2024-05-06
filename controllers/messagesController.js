const Messages = require("../models/messagesModel.js");

const addMessage = async (socket, data) => {
  try {
    const message = await Messages.create({
      chatId: data.chatId,
      messageId: data.messageId,
      sender: socket.headers.email,
      senderId: socket.headers.id,
      message: data.message,
      time: new Date().toISOString(),
      status: "unread",
      success: true,
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

const updateMessageStatus = async (socket, data) => {
  try {
    const updated = await Messages.updateMany(
      { messageId: { $in: data.messageId } },
      { status: "read" }
    );
    if (updated.acknowledged) {
      const messages = await Messages.find();
      return { status: true, messages };
    }
  } catch (err) {
    return { status: false, error: "Internal server error" };
  }
};

module.exports = { addMessage, getMessages, updateMessageStatus };
