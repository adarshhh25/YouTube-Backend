import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const userId = req.user._id
  
  const {content} = req.body
  if(!content) {
    throw new ApiError(400, "Tweet can't be Empty")
  }
  
  const tweet = await Tweet.create({
    content,
    owner: userId
  })

  res
  .status(200)
  .json(new ApiResponse(200, tweet, "You have tweeted successfully"))

});

const getUserTweets = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const tweets = await Tweet.find({ owner: userId })
  if(tweets.length === 0) {
    throw new ApiError(400, "No tweets Found")
  }
  res
  .status(200)
  .json(new ApiResponse(200, tweets, "All tweets Fteched Successfully"))
});

const updateTweet = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {tweet, tweetId} = req.body;

  if(!tweet) {
    throw new ApiError(400, "New Tweet can't be Empty")
  }
  if(!tweetId) {
    throw new ApiError(400, "Tweet Id is required for updating Tweet")
  }
  const existingTweet = await Tweet.findById(tweetId)

  if (!existingTweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if(existingTweet.owner.toString() !== userId.toString()){
    throw new ApiError(400, "You don't have authorization for updating this tweet")
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
    content: tweet
    },
    {
      new: true, runValidators: true
    }
  )
  res
  .status(200)
  .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"))
});

const deleteTweet = asyncHandler(async (req, res) => {
  const {tweetId} = req.body;
  const deletedTweet = await Tweet.findByIdAndDelete(tweetId)
  if(!deletedTweet) {
    throw new ApiError(400, "Could not Delete this Video")
  }
  res
  .status(200)
  .json(new ApiResponse(200, deletedTweet, "Tweet updated successfully"))
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
