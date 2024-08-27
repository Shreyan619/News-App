import { Router } from "express"
import { scrapeAajTak } from "../scrape/hind/aajtak.scrape.js"
import { apiResponse } from "../utils/apiResponse.js"
import { scrapeEl } from "../scrape/spa/el.scrape.js"
import { scrapeFrance } from "../scrape/fra/france24.scrape.js"
import { scrapeEnglish } from "../scrape/eng/english.scrape.js"
import {
    comments,
    getAllArticles,
    getAllComments,
    getEnglish,
    getEnglishTech,
    getFranceMore,
    getFrench,
    getHindi,
    getSpainSport,
    getSpanish,
    search
} from "../controller/article.js"
import { isAuthenticated } from "../middleware/auth.js"
import { scrapeEnglishTech } from "../scrape/eng/englishTech.scrape.js"
import { scrapeFranceMore } from "../scrape/fra/france.more.js"
import { scrapeElSport } from "../scrape/spa/el.sport.js"

const article = Router()

//hindi
article.get("/article/aajtak", async (req, res) => {
    const result = await scrapeAajTak()
    res.status(500)
        .json(new apiResponse(201, "Hindi Articles scraped and saved successfully", result))
})

//spanish
article.get("/article/el", async (req, res) => {
    const result = await scrapeEl()
    res.status(500)
        .json(new apiResponse(201, "Spanish Articles scraped and saved successfully", result))
})

//french
article.get("/article/france", async (req, res) => {
    const result = await scrapeFrance()
    res.status(500)
        .json(new apiResponse(201, "French Articles scraped and saved successfully", result))
})

//english
article.get("/article/english", async (req, res) => {
    try {
        const result = await scrapeEnglish();
        res.status(200).json(new apiResponse(201, "English Articles scraped and saved successfully", result));
        // console.log('Result from scrapeEnglish:', result)
    } catch (error) {
        res.status(error.statusCode || 500).json(new apiResponse(error.statusCode || 500, error.message || "Internal Server Error"));
    }
})

article.get("/article/english/tech", async (req, res) => {
    try {
        const result = await scrapeEnglishTech();
        res.status(200).json(new apiResponse(201, "English Articles scraped and saved successfully", result));
        // console.log('Result from scrapeEnglish:', result)
    } catch (error) {
        res.status(error.statusCode || 500).json(new apiResponse(error.statusCode || 500, error.message || "Internal Server Error"));
    }
})
article.get("/article/spain/sport", async (req, res) => {
    try {
        const result = await scrapeElSport();
        res.status(200).json(new apiResponse(201, "English Articles scraped and saved successfully", result));
        // console.log('Result from scrapeEnglish:', result)
    } catch (error) {
        res.status(error.statusCode || 500).json(new apiResponse(error.statusCode || 500, error.message || "Internal Server Error"));
    }
})
article.get("/article/france/more", async (req, res) => {
    try {
        const result = await scrapeFranceMore();
        res.status(200).json(new apiResponse(201, "English Articles scraped and saved successfully", result));
        // console.log('Result from scrapeEnglish:', result)
    } catch (error) {
        res.status(error.statusCode || 500).json(new apiResponse(error.statusCode || 500, error.message || "Internal Server Error"));
    }
})

article.get("/article", getAllArticles)
article.get("/search", search)
article.post("/article/:articleId/user/:userId/comments", isAuthenticated, comments)
article.get("/article/:articleId/comments", getAllComments)

article.get("/article/englishnews", getEnglish)
article.get("/article/englishtech", getEnglishTech)
article.get("/article/frenchnews", getFrench)
article.get("/article/frenchtech", getFranceMore)
article.get("/article/spanishnews", getSpanish)
article.get("/article/spanishsport", getSpainSport)
article.get("/article/hindinews", getHindi)


export default article