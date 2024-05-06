const express = require("express");
const connectToDB = require("./config/connectToDb");
const cors = require("cors");
const socket = require("socket.io");
const authenticateSocketUser = require("./middlewares/socketAuth");
const {
  addMessage,
  getMessages,
  updateMessageStatus,
} = require("./controllers/messagesController");
const {
  getUserAccounts,
  getSearchedUser,
  loginUser,
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
  socket.emit("connection", null);

  socket.on("add_user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("onlineUsers", onlineUsers);
  });

  socket.on("send_msg", async (data) => {
    const response = await addMessage(socket, data);
    console.log("resp", response);
    const sendMessageToUser = onlineUsers.get(data.receiver);
    console.log("incomDate", data);
    if (sendMessageToUser && response.status) {
      socket.to(sendMessageToUser).emit("receiveMsg", {
        message: data.message,
        sender: socket.headers.email,
        senderId: socket.headers.id,
        chatId: data.chatId,
        messageId: data.messageId,
        time: new Date().toISOString(),
        status: "unread",
        success: true,
      });
    } else {
      const sender = onlineUsers.get(data.senderId);
      if (sender) {
        socket.to(sender).emit("msgFailure", {
          messagesId: data.messageId,
          chatId: data.chatId,
        });
      }
    }
    socket.emit("checkUserOnlineStatus", sendMessageToUser);
    socket.emit("checkMsgDelivered", { response });
  });

  socket.on("msgRead", async (data) => {
    console.log("read");
    const messages = await updateMessageStatus(socket, data);
    console.log("sender", onlineUsers.get(data.senderId));
    const onlineSender = onlineUsers.get(data.senderId);
    if (onlineSender) {
      socket.to(onlineSender).emit("getMessages", messages);
    }
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
