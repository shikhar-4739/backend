import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body

    if(!content) {
        throw new ApiError(400, "content not founded")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    })

    if (!tweet){
        throw new ApiError(400, "tweet is not created")
    }

    return res
    .status(200)
    .json(200, tweet, "tweet created successfully")
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.body

    const gettingUserTweet = await Tweet.aggregate([
        {
            $match:{
                owner: userId
            }
        }
    ])

    if (!gettingUserTweet || gettingUserTweet.length === 0){
        throw new ApiError(400, "tweets not Found")
    }

    return res 
    .status(200)
    .json(200, gettingUserTweet, "Getting User Tweets")
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {newTweet} = req.body
    const {tweetId} = req.params

    if (!newTweet) {
        throw new ApiError(400, "content not found")
    }

    const updatingTweet = await findByIdAndUpdate(tweetId, 
        {newTweet},
        {new: true}
    )

    if(!updatingTweet){
        throw new ApiError(400, "tweet is not updated")
    }

    return res
    .status(200)
    .json(200, updatingTweet, "tweet updated successfully")
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params

    const deletingTweet = await findByIdAndDelete(tweetId, {new: true} ) 

    if (!deletingTweet){
        throw new ApiError(400, "tweet not deleted")
    }

    return res
    .status(200)
    .json(200, deletingTweet, "tweet deleted Successfully")
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}