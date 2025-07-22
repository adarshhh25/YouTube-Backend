import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return next(new ApiError(400, "Invalid Video ID"));
  }

  const allComments = await Comment.find({ video: videoId })
  .sort({ createdAt: -1 })
  .skip((pageNumber - 1) * limitNumber) // Pagination (Skipping previous pages)
  .limit(limitNumber); // Limit results per page

  if(allComments.length === 0) {
    throw new ApiError(400, "No Comments yet")
  }

  return res
  .status(200)
  .json(new ApiResponse(200, allComments, "These are the comments"))

});

const addComment = asyncHandler(async (req, res) => {
  // TODO: Add a comment to a video
  const userId = req.user._id
  const {videoId} = req.params
  const {content}= req.body 
  if(!content) {
    throw new ApiError(400, "Please Provide Something To Comment on Video")
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: userId
  })

  return res
  .status(200)
  .json(new ApiResponse(200, comment, "SucessFully Commented on the video"))
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const {commentId} = req.params
  const {content} = req.body
 
  if(!content) {
    throw new ApiError(400, "Content can't be Empty")
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      content
    },
    {new: true, runValidators: true}
  )

  if (!updatedComment) {
    return next(new ApiError(404, "Comment not found"));
  }

  return res 
  .status(200)
  .json(new ApiResponse(200, updatedComment, "Your Comment has Been Successfully Updated"))
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const {commentId} = req.params
  const deletedComment = await Comment.findByIdAndDelete(commentId)
  if (!deletedComment) {
    return next(new ApiError(404, "Comment not found"));
  }
  return res 
  .status(200)
  .json(new ApiResponse(200, null, "Your Comment has Been Successfully Deleted"))
});

export { getVideoComments, addComment, updateComment, deleteComment };
