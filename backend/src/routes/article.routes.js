import { Router } from "express"
import { scrapeAajTak } from "../scrape/aajtak.scrape.js"
import { apiResponse } from "../utils/apiResponse.js"
import { scrapeEl } from "../scrape/el.scrape.js"
import { scrapeFrance } from "../scrape/france24.scrape.js"
import { scrapeEnglish } from "../scrape/english.scrape.js"
import {
    getAllArticles,
    search
} from "../controller/article.js"

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
    const result = await scrapeEnglish()
    res.status(500)
        .json(new apiResponse(201, "English Articles scraped and saved successfully", result))
})

article.get("/article", getAllArticles)
article.get("/search", search)


export default article