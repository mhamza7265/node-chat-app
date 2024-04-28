const Chat = require("../models/chatModel");

const addChat = async (req, res) => {
  try {
    const users = await Chat.aggregate([
      { $match: { users: { $eq: req.headers.email } } },
      { $match: { users: { $eq: req.body.receiver } } },
    ]);
    console.log("users", users);
    const date = new Date();
    if (users.length < 1) {
      const chat = await Chat.create({
        users: [req.headers.email, req.body.receiver],
        name: req.body.name,
        image: req.body.image,
        date: date.toISOString(),
      });
      return res
        .status(200)
        .json({ status: true, message: "chat created!", chat });
    } else {
      const updated = await Chat.updateOne(
        { _id: users[0]._id },
        { date: date.toISOString() }
      );
      if (updated.acknowledged) {
        const chat = await Chat.find({ users: req.headers.email });

        return res
          .status(200)
          .json({ status: true, message: "Chat date updated!", chat });
      }
    }
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
  }
};

const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.headers.email });
    return res.status(200).json({ status: true, chats });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
  }
};

const getSpecificChat = async (req, res) => {
  try {
    const user = await Chat.aggregate([
      { $match: { users: { $eq: req.headers.email } } },
      { $match: { users: { $eq: req.params.receiver } } },
    ]);
    return res.status(200).json({ status: true, user: user[0] });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
  }
};

module.exports = { addChat, getChats, getSpecificChat };
