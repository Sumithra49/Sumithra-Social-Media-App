import asyncHandler from 'express-async-handler';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { text, image, video } = req.body;

  if (!text && !image && !video) {
    res.status(400);
    throw new Error('Please add some content to your post');
  }

  const post = await Post.create({
    user: req.user._id,
    text,
    image,
    video,
  });

  const populatedPost = await Post.findById(post._id).populate('user', 'username profilePicture');

  res.status(201).json(populatedPost);
});

// @desc    Get all posts for feed
// @route   GET /api/posts
// @access  Private
const getPosts = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id);
  const following = currentUser.following;
  following.push(req.user._id);

  const page = Number(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const posts = await Post.find({ user: { $in: following } })
    .populate('user', 'username profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPosts = await Post.countDocuments({ user: { $in: following } });
  const totalPages = Math.ceil(totalPosts / limit);

  res.json({
    posts,
    page,
    totalPages,
  });
});

// @desc    Get trending posts
// @route   GET /api/posts/trending
// @access  Private
const getTrendingPosts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const posts = await Post.find({})
    .populate('user', 'username profilePicture')
    .sort({ likes: -1, comments: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPosts = await Post.countDocuments();
  const totalPages = Math.ceil(totalPosts / limit);

  res.json({
    posts,
    page,
    totalPages,
  });
});

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Private
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('user', 'username profilePicture')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'username profilePicture',
      },
    });

  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  const { text, image, video } = req.body;
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Check if user is the post owner
  if (post.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized to update this post');
  }

  post.text = text || post.text;
  if (image !== undefined) post.image = image;
  if (video !== undefined) post.video = video;

  const updatedPost = await post.save();
  
  res.json(updatedPost);
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Check if user is the post owner
  if (post.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized to delete this post');
  }

  await Post.deleteOne({ _id: req.params.id });
  
  res.json({ message: 'Post removed' });
});

// @desc    Like a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Check if the post has already been liked by this user
  if (post.likes.includes(req.user._id)) {
    res.status(400);
    throw new Error('Post already liked');
  }

  await Post.findByIdAndUpdate(
    req.params.id,
    { $push: { likes: req.user._id } },
    { new: true }
  );

  // If the post is not by the current user, add notification
  if (post.user.toString() !== req.user._id.toString()) {
    await User.findByIdAndUpdate(post.user, {
      $push: {
        notifications: {
          type: 'like',
          from: req.user._id,
          post: post._id,
        },
      },
    });
  }

  res.status(200).json({ message: 'Post liked successfully' });
});

// @desc    Unlike a post
// @route   PUT /api/posts/:id/unlike
// @access  Private
const unlikePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Check if the post has not been liked by this user
  if (!post.likes.includes(req.user._id)) {
    res.status(400);
    throw new Error('Post has not yet been liked');
  }

  await Post.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  );

  res.status(200).json({ message: 'Post unliked successfully' });
});

// @desc    Get all posts by a user
// @route   GET /api/posts/user/:id
// @access  Private
const getUserPosts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const posts = await Post.find({ user: req.params.id })
    .populate('user', 'username profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPosts = await Post.countDocuments({ user: req.params.id });
  const totalPages = Math.ceil(totalPosts / limit);

  res.json({
    posts,
    page,
    totalPages,
  });
});

export {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getUserPosts,
  getTrendingPosts,
};