import express from "express";
import {
  getAllConversations,
  getMessagesWithUser,
  markMessagesAsRead,
  sendMessage,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all conversations for the current user
router.route("/").get(protect, getAllConversations);

// Get messages between current user and specified user
router.route("/:userId").get(protect, getMessagesWithUser);

// Mark messages as read
router.route("/read/:userId").put(protect, markMessagesAsRead);

// Send a new message
router.route("/").post(protect, sendMessage);
router.route("/:id").get(protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
