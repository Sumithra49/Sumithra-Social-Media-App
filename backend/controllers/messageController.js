import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { recipient, text } = req.body;

  if (!recipient || !text) {
    res.status(400);
    throw new Error("Recipient and text are required");
  }

  const message = await Message.create({
    sender: req.user._id,
    recipient,
    text,
  });

  res.status(201).json(message);
});

// @desc    Get messages between current user and another user
// @route   GET /api/messages/:userId
// @access  Private
const getMessagesWithUser = asyncHandler(async (req, res) => {
  const otherUserId = req.params.userId;

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, recipient: otherUserId },
      { sender: otherUserId, recipient: req.user._id },
    ],
  }).sort({ createdAt: 1 }); // oldest to newest

  res.json(messages);
});

// @desc    Mark messages as read
// @route   PUT /api/messages/read/:userId
// @access  Private
const markMessagesAsRead = asyncHandler(async (req, res) => {
  const otherUserId = req.params.userId;

  const result = await Message.updateMany(
    {
      sender: otherUserId,
      recipient: req.user._id,
      read: false,
    },
    { $set: { read: true } }
  );

  res.json({ updatedCount: result.modifiedCount });
});
// @desc    Get all conversations for current user
// @route   GET /api/messages
// @access  Private
const getAllConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find all distinct users the current user has exchanged messages with
  // This query finds distinct recipient and sender IDs involved with the user
  const messages = await Message.find({
    $or: [{ sender: userId }, { recipient: userId }],
  });

  // Collect unique user IDs from conversations
  const conversationUserIds = new Set();

  messages.forEach((msg) => {
    if (msg.sender.toString() !== userId.toString()) {
      conversationUserIds.add(msg.sender.toString());
    }
    if (msg.recipient.toString() !== userId.toString()) {
      conversationUserIds.add(msg.recipient.toString());
    }
  });

  // Optionally populate user data of conversation partners
  // For that, you might need User model (make sure to import it)
  // Or just send IDs to frontend and fetch user details separately

  res.json(Array.from(conversationUserIds)); // send array of user IDs
});

export {
  getAllConversations,
  getMessagesWithUser,
  markMessagesAsRead,
  sendMessage,
};
