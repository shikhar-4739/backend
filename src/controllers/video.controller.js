import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    //TODO: get all videos based on query, sort, pagination
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    if(!userId){
        throw new ApiError(400, "userId is not found")
    }

    const skippedVideo = (page - 1) * 10;
    const sortingVideo = {};
    if (sortBy && sortType){
        sortingVideo[sortBy] = sortType === 'ase' ? 1 : -1;
    } else {
        sortingVideo["createdAt"] = -1;
    }

    const Videos = await Video.aggregate[
        {
            $match: {
                owner: userId
            }
        },
        query && {
            $match: query
        },
        {
            $skip: skippedVideo
        },
        {
            $sort: sortingVideo
        },
        {
            $limit: limit
        }
    ]

    if(!Videos){
        throw new ApiError(400, "Videos not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, Videos, "Videos found successfully"))
    
})

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    const { title, description} = req.body
    if(!(title && description)){
        throw new ApiError(400, "title must required")
    }

    const video =  req.files?.videoFile[0]?.path;
    const thumbnail = req.files?.thumbnail[0]?.path;

    if(!(video && thumbnail)){
            throw new ApiError(400, "video and thumbnail both required")
    }

    const videoUrl = await uploadOnCloudinary(video)
    const thumbnailUrl = await uploadOnCloudinary(thumbnail)

    const publish = await Video.create({
        title,
        description,
        videoFile: videoUrl?.url,
        thumbnailFile: thumbnailUrl?.url,
        duration:videoUrl?.duration ,
        isPublished: false,
        owner: req.user?._id
    })

    if(!publish){
        throw new ApiError(400, "video not published")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, publish, "video Published Successfully"))
    
})

const getVideoById = asyncHandler(async (req, res) => {
    //TODO: get video by id
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "videoId is not valid")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(400, "video is not available")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, video, "getting video successfully"))
    
})

const updateVideo = asyncHandler(async (req, res) => {
    //TODO: update video details like title, description, thumbnail
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "videoId is not valid")
    }

    const update = await Video.findByIdAndUpdate(videoId, 
        {title, description, thumbnail},
        {new: true}
    )

    if(!update){
        throw new ApiError(400, "video not updated")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, update, "video updated successfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    //TODO: delete video
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "videoId is not valid")
    }

    const remove = await Video.findByIdAndDelete(videoId)

    if(!remove){
        throw new ApiError(400, "video not deleted")
    }

    return res 
    .status(200)
    .json(new ApiResponse(200, remove, "video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "videoId is not valid")
    }

    const video = await Video.findById(videoId)

    if (!(video && video.owner == req.user?._id)){
        throw new ApiError(400, "video not founded")
    }

    const isPublished = !Video.isPublished

    const toggle = await Video.findByIdAndUpdate(videoId, 
    {
        $set: {
            isPublished: isPublished
        }
    },
    {new: true}
    )

    if(!toggle){
        throw new ApiError(400,"status not changed")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, toggle, "changed the publish status"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}