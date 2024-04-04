import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    const skip = page * 10 - limit

    const getComments = await Comment.aggregate([
        {
            $match: {
                owner: videoId
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ])

    if(!getComments){
        throw new ApiError(400, "Comments not found")
    }

    return res
    .status(200)
    .json(200, getComments, "getting Comments Successfully")
})

const addComment = asyncHandler(async (req, res) => {
    const { userId, content } = req.body
    const { videoId } = req.params

    if (!content) {
        throw new ApiError(400, "Enter Your Comments")
    }

    const comment = await Comment.create({
        content,
        owner: userId,
        video: videoId
    })

    if (!comment) {
        throw new ApiError(400, "comment is not created")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "comment created succesfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    const { newComment } = req.body
    const { commentId } = req.params

    if (!newComment) {
        throw new ApiError(400, "enter your comment")
    }
    const updatingComment = await findByIdAndUpdate(commentId,
        { content },
        { new: true }
    )

    if (!updatingComment) {
        throw new ApiError(400, "comment is not updated")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatingComment, "comment updated Sucessfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    const deletingComment = await findByIdAndDelete(commentId, { new: true })

    if (!deletingComment) {
        throw new ApiError(400, "comment is not deleted")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deleteComment, "comment deleted Successfully"))

})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}