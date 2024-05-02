const express = require("express");
const connectToDB = require("./config/connectToDb");
const cors = require("cors");
const socket = require("socket.io");

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
app.use(require("./routes/messageRoutes"));

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

  socket.on("send_msg", (data) => {
    const sendMessageToUser = onlineUsers.get(data.receiver);
    if (sendMessageToUser) {
      socket.to(sendMessageToUser).emit("receiveMsg", {
        message: data.message,
        time: new Date().toISOString(),
        status: "unread",
      });
    }
  });
};

io.on("connection", onConnection);
