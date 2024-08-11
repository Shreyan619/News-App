import { englishArticle } from "../models/english.model.js";
import { spanishArticle } from "../models/spanish.model.js";
import { frenchArticle } from "../models/french.model.js";
import { hindiArticle } from "../models/hindi.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { errorHandler } from "../utils/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { comment } from "../models/comment.model.js";
import mongoose from "mongoose";

const articleModels = {
    Englisharticle: englishArticle,
    Frencharticle: frenchArticle,
    Spanisharticle: spanishArticle,
    Hindiarticle: hindiArticle
}

export const getAllArticles = asyncHandler(async (req, res) => {

    try {
        const english = await englishArticle.find()
        const french = await frenchArticle.find()
        const spanish = await spanishArticle.find()
        const hindi = await hindiArticle.find()

        const allArticles = [
            ...english,
            ...french,
            ...spanish,
            ...hindi
        ]

        res.status(200)
            .json(new apiResponse(200, "all articles fetched successfully", allArticles))
    } catch (error) {
        throw new errorHandler(500, "Error fetching articles", error)
    }
})

export const search = asyncHandler(async (req, res) => {
    try {
        const { query } = req.query

        if (!query) {
            throw new errorHandler(406, "Search query is required")
        }

        const regex = new RegExp(query, "i")
        const english = await englishArticle.find({ $or: [{ title: regex }, { description: regex }] })
        const french = await frenchArticle.find({ $or: [{ title: regex }, { description: regex }] })
        const spanish = await spanishArticle.find({ $or: [{ title: regex }, { description: regex }] })
        const hindi = await hindiArticle.find({ $or: [{ title: regex }, { description: regex }] })

        const allArticles = [
            ...english,
            ...french,
            ...spanish,
            ...hindi
        ]

        res.status(200)
            .json(new apiResponse(202, "Articles fetched successfully", allArticles))
    } catch (error) {
        throw new errorHandler(500, "Error fetching articles", error)
    }
})

export const comments = asyncHandler(async (req, res) => {
    try {
        const { articleId, userId } = req.params
        const { text } = req.body

        if (!articleId || !userId || !text) {
            throw new errorHandler(400, "Article ID, User ID, and text are required")
        }

        if (!mongoose.Types.ObjectId.isValid(articleId) || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new errorHandler(400, "Invalid Article ID or User ID format");
        }

        const addComment = new comment({
            userId,
            articleId,
            text
        })

        await addComment.save()

        res.status(200)
            .json(new apiResponse(201, "comment added successfully", addComment))
    } catch (error) {
        console.error(error)
        throw new errorHandler(400, "error adding comment", error.message)
    }
})

export const getAllComments = asyncHandler(async (req, res) => {
    try {
        const { articleId } = req.params

        if (!articleId) {
            throw new errorHandler(400, "Article ID is required");
        }
        if (!mongoose.Types.ObjectId.isValid(articleId)) {
            throw new errorHandler(400, "Invalid Article ID format");
        }

        // Populates the user details if needed
        const comments = await comment.find({ articleId }).populate('userId', 'name email')

        if (!comments.length) {
            return res.status(404).json(new apiResponse(404, "No comments found for this article"));
        }

        return res.status(200)
            .json(new apiResponse(200, comments, "Comments retrieved successfully"));
    } catch (error) {
        console.error(error)
        throw new errorHandler(500, "Error retrieving comments", error.message)
    }
})