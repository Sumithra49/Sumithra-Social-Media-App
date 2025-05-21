import asyncHandler from 'express-async-handler';
import Comment from '../models/commentModel.js';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';

// @desc    Create a new comment
// @route   POST /api/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  const { postId, text } = req.body;

  if (!text) {
    res.status(400);
    throw new Error('Please add a comment');
  }

  const post = await Post.findById(postId);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const comment = await Comment.create({
    user: req.user._id,
    post: postId,
    text,
  });

  // Add comment to post's comments array
  await Post.findByIdAndUpdate(postId, {
    $push: { comments: comment._id },
  });

  // Add notification to post owner if not the commenter
  if (post.user.toString() !== req.user._id.toString()) {
    await User.findByIdAndUpdate(post.user, {
      $push: {
        notifications: {
          type: 'comment',
          from: req.user._id,
          post: post._id,
        },
      },
    });
  }

  const populatedComment = await Comment.findById(comment._id).populate(
    'user',
    'username profilePicture'
  );

  res.status(201).json(populatedComment);
});

// @desc    Get all comments for a post
// @route   GET /api/comments/:postId
// @access  Private
const getCommentsByPostId = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate('user', 'username profilePicture')
    .sort({ createdAt: -1 });

  res.json(comments);
});

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check if user is the comment owner
  if (comment.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized to update this comment');
  }

  comment.text = text || comment.text;

  const updatedComment = await comment.save();
  
  res.json(updatedComment);
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check if user is the comment owner
  if (comment.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized to delete this comment');
  }

  // Remove comment reference from post
  await Post.findByIdAndUpdate(comment.post, {
    $pull: { comments: comment._id },
  });

  await Comment.deleteOne({ _id: req.params.id });
  
  res.json({ message: 'Comment removed' });
});

// @desc    Like a comment
// @route   PUT /api/comments/:id/like
// @access  Private
const likeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check if the comment has already been liked by this user
  if (comment.likes.includes(req.user._id)) {
    res.status(400);
    throw new Error('Comment already liked');
  }

  await Comment.findByIdAndUpdate(
    req.params.id,
    { $push: { likes: req.user._id } },
    { new: true }
  );

  res.status(200).json({ message: 'Comment liked successfully' });
});

// @desc    Unlike a comment
// @route   PUT /api/comments/:id/unlike
// @access  Private
const unlikeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check if the comment has not been liked by this user
  if (!comment.likes.includes(req.user._id)) {
    res.status(400);
    throw new Error('Comment has not yet been liked');
  }

  await Comment.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  );

  res.status(200).json({ message: 'Comment unliked successfully' });
});

export {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
};