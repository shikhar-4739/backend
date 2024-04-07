import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import {Tweet} from "../models/tweet.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const totalVideos = await Video.aggregate[
        {
            $match: {
                owner: req.user?._id,
                isPublished: true
            }
        },
        {
            $group:{
                _id: null,
                totalVideo : {$sum: 1}
            }
        },
        {
            $project: { totalVideo: 1}
        }
    ]

    if(!totalVideos){
        throw new ApiError(400, "videos not found")
    }

    const totalViews = await Video.aggregate[
        {
            $match:{
                owner: req.user?._id,
                isPublished: true
            }
        },
        {
            $group:{
                _id: null,
                totalView: {$sum: 1}
            }
        },
        {
            $project:{
                totalView: 1
            }
        }
    ]

    if(!totalViews){
        throw new ApiError(400, "Views not available")
    }

    const totalSubscribers = await Subscription.aggregate[
        {
            $match: {
                channel : req.user?._id
            }
        },
        {
            $group:{
                _id: null,
                totalSubscriber: {$sum:1 }
            }
        },
        {
            $project: {
                totalSubscriber: 1
            }
        }
    ]

    if(!totalSubscribers){
        throw new ApiError(400, "Subscribers not available")
    }

    const totalLikes = await Video.aggregate[
        {
            $match:{
                owner: req.user?._id,
                isPublished: true
            }
        },
        {
            $lookup: {
                from: "Like",
                localField: "_id",
                foreignField: "video",
                as: "videoLikes"
            }
        },
        {
            $unwind: "videoLikes"
        },
        {
            $group:{
                _id: null,
                likes: {$sum: 1}
            }
        },
        {
            $project: {
                likes : 1
            }
        }
    ]

    if(!totalLikes){
        throw new ApiError(400, "likes not available")
    }

    const totalTweet = await Tweet.aggregate[
        {
            $match: {
                owner: req.user?._id
            }
        },
        {
            $group: {
                _id: null,
                tweets: {$sum: 1}
            }
        },
        {
            $project: {
                tweets : 1
            }
        }
    ]

    if(!totalTweet){
        throw new ApiError(400, "tweet not available")
    }

    return res
    .status(200)
    .json(new Response(200, {totalVideos, totalViews, totalSubscribers, totalLikes, totalTweet}, "getting channel status successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const videos = await Video.aggregate[
        {
            $match: {
                owner: req.user?._id,
                isPublished: true
            }
        },
        {
            $project: 1
        }
    ]

    if(!videos || videos.length === 0){
        throw new ApiError(400, "Not getting Videos")
    }

    return res
    .status(200)
    .json(new Response(200, videos, "getting videos successfully"))
})

export {
    getChannelStats,
    getChannelVideos
}