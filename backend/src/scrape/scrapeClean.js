import cron from "node-cron"
import { scrapeAajTak } from "./hind/aajtak.scrape.js"
import { scrapeEl } from "./spa/el.scrape.js"
import { scrapeEnglish } from "./eng/english.scrape.js"
import { scrapeFrance } from "./fra/france24.scrape.js"
import { englishArticle } from "../models/english.model.js"
import { frenchArticle } from "../models/french.model.js"
import { spanishArticle } from "../models/spanish.model.js"
import { hindiArticle } from "../models/hindi.model.js"
import { errorHandler } from "../utils/errorHandler.js"
import { moveBookmarkedArticlesToBookmarkModel } from "../controller/user.js"
import { getEnglish } from "../controller/article.js"
import { scrapeEnglishTech } from "./eng/englishTech.scrape.js"
import { scrapeFranceMore } from "./fra/france.more.js"
import { scrapeElSport } from "./spa/el.sport.js"
import { scrapeHindi } from "./hind/hindi.scrape.js"
import { scrapeLatest } from "./homepagenews/latest.scrape.js"


// delete old articles
const deleteOldArticles = async (req, res) => {


    try {
        const cutOffDate = new Date(Date.now() - 10 * 60 * 1000)

        await englishArticle.deleteMany({ createdAt: { $lt: cutOffDate } })
        await spanishArticle.deleteMany({ createdAt: { $lt: cutOffDate } })
        await frenchArticle.deleteMany({ createdAt: { $lt: cutOffDate } })
        await hindiArticle.deleteMany({ createdAt: { $lt: cutOffDate } })



        console.log("old articles deleted")
    } catch (error) {


        console.error(error.message)
        throw new errorHandler(500, "Error deleting old articles :", error.message)
    }
}

cron.schedule("*/1 * * * *", async () => {
    console.log('Running scheduled task for scraping and cleaning')

    try {
        // await cleanUpInvalidBookmarks()
        await deleteOldArticles();
        await scrapeAajTak();
        await scrapeEl();
        await scrapeFrance();
        await scrapeEnglish();
        await scrapeEnglishTech()
        await scrapeFranceMore()
        await scrapeElSport()
        await scrapeHindi()
        await scrapeLatest()

        console.log("Scraping and cleaning completed successfully")
    } catch (error) {
        console.error("Error during scheduled task:", error)
    }
})

cron.schedule("*/10 * * * *", async () => {
    console.log('Running scheduled task to move bookmarked articles and delete old ones');
    await moveBookmarkedArticlesToBookmarkModel()
})

cron.schedule("0 * * * *", async () => {
    console.log('Running scheduled task to fetch English articles');

    try {
        const req = {}; // simulate the request object here
        const res = {
            status: (statusCode) => ({
                json: (response) => console.log('Fetched Articles:', response),
            }),
        };

        await getEnglish(req, res);

        console.log("Fetching completed successfully")
    } catch (error) {
        console.error("Error during scheduled task:", error)
    }
});