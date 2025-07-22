import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const toggleSubscription = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { channelId } = req.params;
  if(!channelId) {
    throw new ApiError(400, "Please Provide Channel to Subscribe")
  }
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel ID");
  }
  const subscribedAlready = await Subscription.findOne({ subscriber: userId, channel: channelId})

  if(subscribedAlready) {
   const unsubscribe = await Subscription.deleteOne({_id: subscribedAlready._id})
   return res
   .status(200)
   .json(new ApiResponse(200, unsubscribe, "Successfully Unsubscribed the Channel"))
  }

  const subscribed =  await Subscription.create({
    subscriber : userId,
    channel: channelId
  })

  return res
   .status(200)
   .json(new ApiResponse(200, subscribed, "Successfully Subscribed the Channel"))
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if(!channelId) {
    throw new ApiError(400, "Please Provide a Channel ID")
  }
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel ID");
  }

  const subscribers = await Subscription.find({channel: channelId})

  if(subscribers.length === 0) {
    throw new ApiError(400, "No One has subscribed this channel yet ");
  }

  return res
  .status(200)
  .json(new ApiResponse(200, subscribers, "These are All Subscribers of the channel"))
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.user._id;

  if(!subscriberId) {
    throw new ApiError(400, "Please Provide a Subscriber ID")
  }
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid Subscriber ID");
  }

  const channels = await Subscription.find({subscriber: subscriberId})

  if(channels.length === 0) {
    throw new ApiError(404, "You have not Subscribed Any Channel yet")
  }

  return res
  .status(200)
  .json(new ApiResponse(200, channels, "These channels are subscribed by you"))
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
