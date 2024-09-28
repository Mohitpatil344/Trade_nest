const express = require("express");
const {
  createChat,
  findUserChats,
  findChats,
} = require("../Controllers/chatController");
const router = express.Router();

router.post("/", createChat);
router.get("/find/:firstId/:secondId", findChats);
router.get("/chats/:userId", findUserChats);
module.exports = router
