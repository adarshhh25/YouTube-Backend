import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

  let filter = {};

  // Parse the query string if provided
  if (query) {
    try {
      filter = JSON.parse(query);
    } catch (error) {
      throw new ApiError(400, "Invalid query format. Use valid JSON.");
    }
  }

  // If userId is provided, filter videos by owner
  if (userId) {
    filter.owner = userId;
  }

  // Convert page & limit to numbers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Fetch paginated & sorted videos
  const videos = await Video.find(filter)
    .sort({ [sortBy]: sortType === "asc" ? 1 : -1 }) // Sorting
    .skip((pageNumber - 1) * limitNumber) // Pagination (Skipping previous pages)
    .limit(limitNumber); // Limit results per page

  const totalVideos = await Video.countDocuments(filter); // Count total videos

  return res.status(200).json(
    new ApiResponse(200, {
      videos,
      pagination: {
        totalVideos,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalVideos / limitNumber),
      },
    }, "Successfully Fetched All Videos")
  );
});

  

const publishAVideo = asyncHandler(async (req, res) => {

  const userId = req.user.id; // Assuming req.user is set by auth middleware
    if (!userId) {
      throw new ApiError(401, "Unauthorized: User not found")
    }

  const { title, description, duration } = req.body;

  if(!title || !description || !duration) {
    throw new ApiError(400, "All Fields are Required")
  }
  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
  
  if(!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "All Fields are Required")
  }

  const video = await uploadOnCloudinary(videoLocalPath)
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

  if(!video || !thumbnail) {
    throw new ApiError(500, "Error uploading files to Cloudinary")
  }

  const videoUploaded = await Video.create({
    videoFile: video.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration,
    owner: userId,
  })

  return res
    .status(201)
    .json(new ApiResponse(201, videoUploaded, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const videoRequired = await Video.findById(videoId)

  if(!videoRequired) {
   throw new ApiError(404, "No Such video found")
  }
  return res
  .status(200)
  .json(new ApiResponse(200, videoRequired, "Video fetched successfully"))
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if(!videoId) {
    throw new ApiError(400, "Please Provide Video Id to be Updated")
  }
  const {title, description, thumbnail} = req.body;
  if(!title && !description && !thumbnail) {
    throw new ApiError(400, "At least one field must be provided for update")
  }
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {title, description, thumbnail}
    },
    {
      new: true, runValidators: true
    }
  ) 

  if (!updatedVideo) {
    throw new ApiError(404, "Video not found");
  }

  return res.status(200).json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});


const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  
  if(!videoId) {
    throw new ApiError(400, "Please Provide Video Id to be Deleted")
  }

  const deletedVideo = await Video.findByIdAndDelete(videoId)

  if(!deletedVideo) {
    throw new ApiError(400, "Could not delete video")
  }

  return res.status(200).json(new ApiResponse(200, deletedVideo, "Video deleted successfully"));
})

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if(!videoId) {
    throw new ApiError(400, "Please provide video Id");
  }
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  video.isPublished = !video.isPublished;

  await video.save();

  return res.status(200).json(new ApiResponse(200, video, "Publish status toggled successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
