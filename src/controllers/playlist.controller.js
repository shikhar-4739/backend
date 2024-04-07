import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    //TODO: create playlist
    const {name, description} = req.body

    if (!name){
        throw new ApiError(400, "playlist name must required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id,
    })

    if(!playlist){
        throw new ApiError(400, "playlist is not created")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    //TODO: get user playlists
    const {userId} = req.params
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "userId is not valid")
    }

    const userPlaylist = await Playlist.aggregate([
        {
            $match: {
                owner: userId
            }
        }
    ])

    if(!userPlaylist) {
        return res.status(200).json(200, "no playlist found")
    }
    
    return res
    .status(200)
    .json(200, userPlaylist, "playlist found successfully")
})

const getPlaylistById = asyncHandler(async (req, res) => {
    //TODO: get playlist by id
    const {playlistId} = req.params
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "playlistId is not valid")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(400, "playlist not found by Id")
    }

    return res
    .status(200)
    .json(200, playlist, "playlist found successfully")
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Id is not valid")
    }

    const video = await Video.findById(videoId)
    if(!video || !video.isPublished){
        throw new ApiError(400, "video not found")
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(400, "playlist not found")
    }

    playlist.videos.push(videoId)
    const updatedPlaylist = await playlist.save();

    if(!updatedPlaylist){
        throw new ApiError(400, "video deos not added")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "video added successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    // TODO: remove video from playlist
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Id is not valid")
    }

    const video = await Video.findById(videoId)
    if(!video || !video.isPublished){
        throw new ApiError(400, "video not found")
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(400, "playlist not found")
    }

    playlist.videos.pull(videoId)
    const updatedPlaylist = await playlist.save();

    if(!updatedPlaylist){
        throw new ApiError(400, "not deleted the video")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "video deleted successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    // TODO: delete playlist
    const {playlistId} = req.params
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "playlistId is not valid")
    }

    const deleted = await Playlist.findByIdAndDelete(playlistId)

    if(!deleted){
        throw new ApiError(400, "playlist not deleted")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, deleted, "playlist deleted successfully"))
    
})

const updatePlaylist = asyncHandler(async (req, res) => {
    //TODO: update playlist
    const {playlistId} = req.params
    const {name, description} = req.body
    if(!name){
        throw new ApiError(400, "name is required")
    }
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "playlistId is not valid")
    }

    const update = await Playlist.findByIdAndUpdate(playlistId,
        {
            $set: {
                name,
                description
            }
        },
        {new: true}
    )

    if(!update){
        throw new ApiError(400, "playlist does not updated")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, update, "playlist updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}