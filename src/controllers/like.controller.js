import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on video
    const {videoId} = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "tweetId is not valid")
    }

    const video = await Video.findById(videoId)

    if(!(video || video.isPublished)){
        throw new ApiError(400, "video not found")
    }

    const userAlreadyLiked = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    })

    if(userAlreadyLiked){
        userAlreadyLiked.remove()
        return res.status(200).json(new Response(200, "remove like successfully"))
    }

    const likedVideo = await Like.create({
        video: videoId,
        likedBy: req.user?._id
    })

    if(!likedVideo){
        throw new ApiError(400, "unable to like the video")
    }

    return res
    .status(200)
    .json(200, likedVideo, "video liked Successfully")
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on comment
    const {commentId} = req.params
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "tweetId is not valid")
    }

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(400, "comment not found")
    }

    const userAlreadyLiked = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id
    })

    if(userAlreadyLiked){
        userAlreadyLiked.remove()
        return res.status(200).json(new Response(200, "remove like successfully"))
    }

    const likedComment = await Like.create({
        comment: commentId,
        likedBy: req.user?._id
    })

    if(!likedComment){
        throw new ApiError(400, "unable to like the comment")
    }

    return res
    .status(200)
    .json(200, likedComment, "comment liked successfully")

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on tweet
    const {tweetId} = req.params
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "tweetId is not valid")
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(400, "tweet not found")
    }

    const userAlreadyLiked = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    })

    if(userAlreadyLiked){
        userAlreadyLiked.remove()
        return res.status(200, "like remove successfully")
    }

    const likedTweet = await Like.create({
        tweet: tweetId,
        likedBy: req.user?._id
    })

    if(!likedTweet){
        throw new ApiError(400, "unable to like the tweet")
    }

    return res
    .status(200)
    .json(200, likedTweet, "Tweet Liked Successfully")
    
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const likedVideos = await Like.aggregate[
        {
            $match: {
                likedBy: req.user?._id
            }
        },
        {
            $lookup: {
                from : "Video",
                localField: "video",
                foreignField: "_id",
                as: "likedVideos"
            }
        },
        {
            $unwind: {
                path: "$likedVideos",
                includeArrayIndex: 0
            }
        },
        {
            $project: {
                likedVideo: 1
            }
        }
    ]

    if(!likedVideos){
        throw new ApiError(400, "Not able to find liked videos")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "getting Liked Videos Successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}