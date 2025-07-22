import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const { name, description, videoIds } = req.body;
  if(!name || !description || !videoIds) {
    throw new ApiError(400, "Please Provide Name, Description, VideoId for Creating Playlist")
  }
  if (!Array.isArray(videoIds) || videoIds.length === 0) {
    throw new ApiError(400, "Please provide at least one valid Video ID");
  }

  if (!videoIds.every((id) => isValidObjectId(id))) {
    throw new ApiError(400, "Invalid Video ID(s) provided");
  }
  const playlist = await Playlist.create({
    name,
    description,
    videos : [videoIds],
    owner: userId
  })

  return res
  .status(200)
  .json(new ApiResponse(200,playlist, "Playlist created Successfully"))
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id;
  const { userId } = req.params;
  if(!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Please provide valid User ID");
  }

  if (loggedInUserId.toString() !== userId) {
    throw new ApiError(403, "Unauthorized: You can only view your own playlists.");
  }

  const allPlaylists = await Playlist.find({owner: userId})

  if(allPlaylists.length === 0) {
    throw new ApiError(404, "You don't have a playlist yet");
  }

  return res
  .status(200)
  .json(new ApiResponse(200, allPlaylists, "These are the playlists of your Channel"))
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if(!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Please provide valid User ID");
  }

  const playlistRequired = await Playlist.findById(playlistId);

  if(!playlistRequired) {
    throw new ApiError(404, "No Playlist Found");
  }

  return res
  .status(200)
  .json(new ApiResponse(200, playlistRequired, "This is the Reqiured Playlist"))
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {

  const { playlistId, videoId } = req.params;

  if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Please provide a valid Playlist and Video ID")
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {$push: {videos: videoId}},
    {new: true, runValidators: true}
  )

  if (!updatedPlaylist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
  .status(200)
  .json(new ApiResponse(200, updatedPlaylist, "Playlistupdated SuccessFully"))

});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Please provide a valid Playlist and Video ID")
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (!playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video not found in this playlist");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {$pull: {videos: videoId}},
    {new: true, runValidators: true}
  )

  return res
  .status(200)
  .json(new ApiResponse(200, updatedPlaylist, "Playlistupdated SuccessFully"))
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
 
  if(!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Please provide a Valid ID");
  }

  const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

  if(!deletedPlaylist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
  .status(200)
  .json(new ApiResponse(200, deletedPlaylist, "Playlist Deleted SuccessFully"))
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  
  if(!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Please provide a Valid ID");
  }

  if(!name || !description) {
    throw new ApiError(400, "Please provide Name and Description To be updated");
  }

  const upadatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      name,
      description
    },
    { new: true, runValidators: true }  
  )
 
  return res
  .status(200)
  .json(new ApiResponse(200, upadatedPlaylist, "Playlist Updated Successfully"))

});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
