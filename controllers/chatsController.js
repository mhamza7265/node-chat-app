const Chat = require("../models/chatModel");

const addChat = async (req, res) => {
  console.log("req body", req.body);
  const email1 = req.headers.email;
  const email2 = req.body.receiver;
  try {
    const users = await Chat.aggregate([
      { $match: { users: { $eq: req.headers.email } } },
      { $match: { users: { $eq: req.body.receiver } } },
    ]);
    const date = new Date();
    if (users.length < 1) {
      const chat = await Chat.create({
        users: [req.headers.email, req.body.receiver],
        userIds: [req.headers.id, req.body.userId],
        name: [
          req.body.name,
          req.headers.firstName + " " + req.headers.lastName,
        ],
        image: { [email1]: req.body.image1, [email2]: req.body.image2 },
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
