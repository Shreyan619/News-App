import cron from "node-cron"
import { scrapeAajTak } from "./aajtak.scrape.js"
import { scrapeEl } from "./el.scrape.js"
import { scrapeEnglish } from "./english.scrape.js"
import { scrapeFrance } from "./france24.scrape.js"
import { englishArticle } from "../models/english.model.js"
import { frenchArticle } from "../models/french.model.js"
import { spanishArticle } from "../models/spanish.model.js"
import { hindiArticle } from "../models/hindi.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { errorHandler } from "../utils/errorHandler.js"
import { bookmark } from "../models/bookmark.model.js"


// delete old articles
const deleteOldArticles = asyncHandler(async (req, res) => {
    try {
        const cutOffDate = new Date(Date.now() - 10 * 60 * 1000)

        await englishArticle.deleteMany({ createdAt: { $lt: cutOffDate } }).session(session)
        await spanishArticle.deleteMany({ createdAt: { $lt: cutOffDate } }).session(session)
        await frenchArticle.deleteMany({ createdAt: { $lt: cutOffDate } }).session(session)
        await hindiArticle.deleteMany({ createdAt: { $lt: cutOffDate } }).session(session)


        console.log("old articles deleted")
    } catch (error) {
        throw new errorHandler(500, "Error deleting old articles :", error)
    }
})

const cleanUpInvalidBookmarks = asyncHandler(async () => {
    try {
        const articleModels = [englishArticle, spanishArticle, frenchArticle, hindiArticle];

        // Iterate over all article models
        for (const model of articleModels) {
            const validArticleIds = await model.find().distinct('_id');
            await bookmark.deleteMany({
                articleId: { $nin: validArticleIds }
            });
        }

        console.log('Invalid bookmarks cleaned up successfully');
    } catch (error) {
        console.error('Error during bookmarks cleanup:', error);
    }
})

cron.schedule("*/5 * * * *", async () => {
    console.log('Running scheduled task for scraping and cleaning')

    try {
        // await cleanUpInvalidBookmarks()
        await deleteOldArticles();
        await scrapeAajTak();
        await scrapeEl();
        await scrapeFrance();
        await scrapeEnglish();

        console.log("Scraping and cleaning completed successfully")
    } catch (error) {
        console.error("Error during scheduled task:", error)
    }
})