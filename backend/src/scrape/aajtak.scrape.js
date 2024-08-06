// hindi news

import puppeteer from "puppeteer";
import { Article } from "../models/article.model.js"
import { apiResponse } from "../utils/apiResponse.js";
import { errorHandler } from "../utils/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// const saveArticlesToDB = async (articles) => {
//     try {

//         const savedArticles = await Article.insertMany(articles);
//         console.log('Article Saved to DB: ', savedArticles)
//     } catch (error) {
//         console.error('Error saving articles to the database:', error);
//     }
// }

export const scrapeAajTak = asyncHandler(async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null
        });

        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto('https://www.aajtak.in/', { waitUntil: 'networkidle2' });

        const containerSelector = "#badi_khabar_1";

        const selectors = [
            {
                title: "a > div:nth-child(1) > h2",
                link: "a",
                image: "a > div.thumb > img",
                description: "a > div:nth-child(3) > p"
            },
            {
                title: "div > h3 > a",
                link: "div > h3 > a",
                image: "div.thumb.video_asso > img",
                description: "div.single_str > a > div.title > h3"
            },
            {
                // title: "li:nth-child(1) > a",
                link: "li:nth-child(1) > a",
                image: "li:nth-child(1) > a > div.thumb > img",
                description: "li:nth-child(1) > a > div.title.title-bold > h3"
            },
            {
                // title: "div > h3 > a",
                link: "li:nth-child(2) > a",
                image: "li:nth-child(2) > a > div.thumb.video_asso > img",
                description: "li:nth-child(2) > a > div.title.title-bold > h3"
            },
            {
                // title: "div > h3 > a",
                link: "li:nth-child(3) > a",
                image: "li:nth-child(3) > a > div.thumb > img",
                description: "li:nth-child(3) > a > div.title.title-bold > h3"
            },
            {
                // title: "div > h3 > a",
                link: "li:nth-child(4) > a",
                image: "li:nth-child(4) > a > div.thumb.video_asso > img",
                description: "li:nth-child(4) > a > div.title.title-bold > h3"
            },
            {
                // title: "div > h3 > a",
                link: "li:nth-child(5) > a",
                image: "li:nth-child(5) > a > div.thumb > img",
                description: "li:nth-child(5) > a > div.title.title-bold > h3"
            },
            {
                // title: "div > h3 > a",
                link: "li:nth-child(6) > a",
                image: "li:nth-child(6) > a > div.thumb > img",
                description: "li:nth-child(6) > a > div.title.title-bold > h3"
            },
            {
                // title: "div > h3 > a",
                link: "li:nth-child(7) > a",
                image: "li:nth-child(7) > a > div.thumb > img",
                description: "li:nth-child(7) > a > div.title.title-bold > h3"
            },

        ];

        const scrapedData = []

        // console.log(`Waiting for selector: ${containerSelector}`);
        await page.waitForSelector(containerSelector, { timeout: 2000 });

        const articles = await page.$$(containerSelector);

        for (const article of articles) {

            for (const { title, link, image, description } of selectors) {
                try {
                    const isAttached = await page.evaluate(el => el.isConnected, article);

                    if (!isAttached) {
                        console.log("Article element is detached, skipping...");
                        continue;
                    }

                    const articleTitle = await article.$eval(title, el => el.getAttribute('title') || el.innerText).catch(() => null);

                    const articleLink = await article.$eval(link, el => el.href).catch(() => null);

                    const articleImage = image ? await article.$eval(image, el => el.src).catch(() => null) : null;

                    const articleDescription = description ? await article.$eval(description, el => el.textContent.trim()).catch(() => null) : null;



                    if (articleTitle || articleLink || articleImage || articleDescription) {
                        const articleData = {
                            title: articleTitle,
                            link: articleLink,
                            description: articleDescription,
                            image: articleImage,
                        };


                        const existingArticle = await Article.findOne({ link: articleData.link })

                        if (!existingArticle) {

                            const newArticle = new Article(articleData)
                            await newArticle.save()
                            scrapedData.push(articleData)

                        } else {

                            console.log(`Article already exists: ${articleData.link}`);

                        }
                    }
                } catch (innerError) {
                    console.error("Error evaluating element:", innerError);
                }
            }
        }

        // console.log(scrapedData);
        await browser.close();
        res.status(200)
            .json(new apiResponse(201, "Articles scraped and saved successfully"))

    } catch (error) {
        console.error("Error during scraping:", error);
        throw new errorHandler(501, "Error during scraping")
    }
});

