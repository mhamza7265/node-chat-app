const express = require("express");
const connectToDB = require("./config/connectToDb");
const cors = require("cors");
const socket = require("socket.io");
const authenticateSocketUser = require("./middlewares/socketAuth");
const { addMessage, getMessages } = require("./controllers/messagesController");
const {
  getUserAccounts,
  getSearchedUser,
} = require("./controllers/authenticationController");

connectToDB();
const app = express();
const server = app.listen("3000", () => {
  console.log("Server started on port 3000");
});
const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
app.use(cors());
app.use(express.json());
app.use(express.static("files"));

app.use(require("./routes/authenticationRoutes"));
app.use(require("./routes/chatRoutes"));

global.onlineUsers = new Map();
const onConnection = (socket) => {
  console.log("made socket connection", socket.id);
  socket.emit("connection", null);
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });

  socket.on("add_user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("onlineUsers", onlineUsers);
  });

  socket.on("send_msg", async (data) => {
    const sendMessageToUser = onlineUsers.get(data.receiver);
    if (sendMessageToUser) {
      socket.to(sendMessageToUser).emit("receiveMsg", {
        message: data.message,
        sender: socket.headers.email,
        chatId: data.chatId,
        time: new Date().toISOString(),
        status: "unread",
      });
    }
    const response = await addMessage(socket, data);
    socket.emit("checkUserOnlineStatus", sendMessageToUser);
    socket.emit("checkMsgDelivered", { message: response });
  });

  socket.on("getUsersRequest", async (data) => {
    const users = await getUserAccounts(socket, data);
    socket.emit("getUsers", users);
  });

  socket.on("getSearchedUserRequest", async (data) => {
    const users = await getSearchedUser(socket, data);
    socket.emit("getSearchedUsers", users);
  });

  socket.on("getMessages", async (data) => {
    const messages = await getMessages(socket, data);
    socket.emit("getMsgs", messages);
  });
};

io.use(authenticateSocketUser);
io.on("connection", onConnection);
