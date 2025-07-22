import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { videoId } = req.params;
  if(!isValidObjectId(videoId) || !videoId) {
    throw new ApiError(400, "Please Provide a Valid ID")
  }
  const alreadyLiked = await Like.findOne({
    video: videoId,
    likedBy: userId
  })

  if(alreadyLiked) {
  const unLiked =  await Like.deleteOne({
    video: videoId,
    likedBy: userId
  })
  return res
  .status(200)
  .json(new ApiResponse(200, null, "SuccessFully Unliked the Video"))
  }

  const liked = await Like.create({
    video: videoId,
    likedBy: userId
  })

  return res
  .status(200)
  .json(new ApiResponse(200, liked, "SuccessFully liked the Video"))
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { commentId } = req.params;
  if(!isValidObjectId(commentId) || !commentId) {
    throw new ApiError(400, "Please Provide a Valid ID")
  }
  const alreadyLiked = await Like.findOne({
    comment: commentId,
    likedBy: userId
  })

  if(alreadyLiked) {
  const unLiked =  await Like.deleteOne({
    comment: commentId,
    likedBy: userId
  })
  return res
  .status(200)
  .json(new ApiResponse(200, null, "SuccessFully Unliked the Comment"))
  }

  const liked = await Like.create({
    comment: commentId,
    likedBy: userId
  })

  return res
  .status(200)
  .json(new ApiResponse(200, liked, "SuccessFully liked the Comment"))
});



const toggleTweetLike = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { tweetId } = req.params;
  if(!isValidObjectId(tweetId) || !tweetId) {
    throw new ApiError(400, "Please Provide a Valid ID")
  }
  const alreadyLiked = await Like.findOne({
    tweet: tweetId,
    likedBy: userId
  })

  if(alreadyLiked) {
  const unLiked =  await Like.deleteOne({
    tweet: tweetId,
    likedBy: userId
  })
  return res
  .status(200)
  .json(new ApiResponse(200, null, "SuccessFully Unliked the tweet"))
  }

  const liked = await Like.create({
    tweet: tweetId,
    likedBy: userId
  })

  return res
  .status(200)
  .json(new ApiResponse(200, liked, "SuccessFully liked the tweet"))
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const likedVideos = await Like.find({
    likedBy: userId
  }).populate("video").select("video createdAt")

  if(likedVideos.length === 0) {
    throw new ApiError(404, "You have not Liked any Videos yet")
  }

  return res
  .status(200)
  .json(new ApiResponse(200,likedVideos, "SuccessFully Fetched Liked Videos"))
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
