import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "channelId is not valid")
    }

    const channel = await User.findById(channelId)
    if(!channel){
        throw new ApiError(400, "channel does not exist")
    }

    const user = await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(400, "user does not exist")
    }

    const subscriber = await Subscription.find({
        channel: isValidObjectId(channelId),
        subscriber: isValidObjectId(req.user?._id)
    })

    let toggle;
    if(!subscriber){
        toggle = await Subscription.create({
            channel: channelId ,
            subscriber: req.user?._id
        })
        if(!toggle){
            throw new ApiError(400, "something went wrong")
        }
    } else{
        toggle = await Subscription.findByIdAndDelete(subscriber._id)
    }

    return res
    .status(200)
    .json(new ApiResponse(200, toggle, "toggling the state Successfully"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "channelId is not valid")
    }

    const channel = await User.findById(channelId)

    if(!channel){
        throw new ApiError(400, "channel does not exist")
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: channelId
            }
        },
        {
            $group:{
                _id: null,
                totalCount: {$sum: 1}
            }
        }
    ])

    if(!subscribers || subscribers.length === 0){
        throw new ApiError(400, "subscribers not founded")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "getting subscribers Successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400, "subscriberId is not valid")
    }

    const subscriber = await User.findById(subscriberId)

    if(!subscriber){
        throw new ApiError(400, "subscriber does not exist")
    }

    const channels = await Subscription.aggregate([
        {
            $match: {
                subscriber: subscriberId
            }
        },
        {
            $group: {
                _id: null,
                totalCount: {$sum : 1}
            }
        }
    ])

    if(!channels || channels.length === 0){
        throw new ApiError(400, "channel not founded")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, channels, "getting Channels Successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}