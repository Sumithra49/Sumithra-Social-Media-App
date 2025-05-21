import express from 'express';
import {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createComment);

router.get('/:postId', protect, getCommentsByPostId);

router.route('/:id')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

router.put('/:id/like', protect, likeComment);
router.put('/:id/unlike', protect, unlikeComment);

export default router;