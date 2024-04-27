const express = require("express");
const app = express();
const upload = require("../middlewares/fileStorage");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

const { addChat, getChats } = require("../controllers/chatsController");

// router.use(authMiddleware);
router.post("/chat", authMiddleware, addChat);
router.get("/chats", authMiddleware, getChats);

module.exports = router;
