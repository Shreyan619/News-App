import { englishArticle } from "../models/english.model.js";
import { spanishArticle } from "../models/spanish.model.js";
import { frenchArticle } from "../models/french.model.js";
import { hindiArticle } from "../models/hindi.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { errorHandler } from "../utils/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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