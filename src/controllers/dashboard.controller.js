import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const userId = req.user._id;

  //Inefficient due to unneccessary use of find()
  // const allVideoCounts = await Video.find({owner: userId}).countDocuments(); 
  // const totalSubscriber = await Subscription.find({channel: userId}).countDocuments();

  const allVideoCounts = await Video.countDocuments({ owner: userId });
  const totalSubscriber = await Subscription.countDocuments({ channel: userId });

  const userVideoIds = await Video.find({ owner: userId }).distinct("_id");

  const totalLikes = await Like.countDocuments({
    video: { $in: userVideoIds }
  });

  return res
  .status(200)
  .json(new ApiResponse(200, {allVideoCounts, totalSubscriber, totalLikes}, "This is required Data"))
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const userId = req.user._id;

  const allVideos = await Video.find({owner: userId})

  if(allVideos.length === 0) {
    throw new ApiError(400, "You have not Uploaded Any Videos Yet")
  }

  return res
  .status(200)
  .json(new ApiResponse(200, allVideos, "Successfully fetched All Videos"))

  
});

export { getChannelStats, getChannelVideos };
