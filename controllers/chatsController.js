const Chat = require("../models/chatModel");

const addChat = async (req, res) => {
  try {
    const users = await Chat.aggregate([
      { $match: { sender: { $eq: req.headers.email } } },
      { $match: { receiver: { $eq: req.body.receiver } } },
    ]);
    console.log("users", users);
    if (users.length < 1) {
      const chat = await Chat.create({
        sender: req.headers.email,
        receiver: req.body.receiver,
        name: req.body.name,
        image: req.body.image,
      });
      return res
        .status(200)
        .json({ status: true, message: "chat created!", chat });
    } else {
      return res
        .status(200)
        .json({ status: false, error: "Chat already exists!" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
  }
};

const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ sender: req.headers.email });
    return res.status(200).json({ status: true, chats });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
  }
};

module.exports = { addChat, getChats };
