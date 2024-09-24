const chatModel = require("../Models/chatModel");

// Create a chat between two users
const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  if (!firstId || !secondId) {
    return res.status(400).json({ error: "FirstId and SecondId are required" });
  }

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] }
    });

    if (chat) return res.status(200).json(chat);

    const newChat = new chatModel({
      members: [firstId, secondId]
    });
    const response = await newChat.save();
    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get chats for a specific user
const findUserChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    const chats = await chatModel.find({
      members: { $in: [userId] }
    });
    res.status(200).json(chats);
  } catch (error) {
    console.error("Error finding user chats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Find a chat between two specific users
const findChats = async (req, res) => {
  const { firstId, secondId } = req.params;
  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] }
    });
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.status(200).json(chat);
  } catch (error) {
    console.error("Error finding chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { findChats, findUserChats, createChat };
