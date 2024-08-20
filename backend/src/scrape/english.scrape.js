// english newshttps://abcnews.go.com/Live

import puppeteer from "puppeteer";
import { apiResponse } from "../utils/apiResponse.js";
import { errorHandler } from "../utils/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { englishArticle } from "../models/english.model.js";



export const scrapeEnglish = asyncHandler(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        await page.goto('https://abcnews.go.com/Live', { waitUntil: 'networkidle2' });

        const containerSelector = "#bandlist-component > div:nth-child(3)"

        const selectors = [
            {
                title: "li:nth-child(2) > a > h3 > span",
                link: "li:nth-child(2) > a",
                image: "li:nth-child(2) > a > div > figure > div.Image__Wrapper.aspect-ratio--child > img",

            },
            {
                title: "li:nth-child(3) > a > h3 > span",
                link: "li:nth-child(3) > a",
                image: "li:nth-child(3) > a > div > figure > div.Image__Wrapper.aspect-ratio--child > img",

            },
            {
                title: "li:nth-child(4) > a > h3 > span",
                link: "li:nth-child(4) > a",
                image: "li:nth-child(4) > a > div.MediaPlaceholder.relative.MediaPlaceholder--16x9.cursor-pointer.MediaPlaceholder--button-hover.VideoTile__Media > figure > div.Image__Wrapper.aspect-ratio--child > img",

            },




        ];

        const scrapedData = []

        // console.log(`Waiting for selector: ${containerSelector}`);
        await page.waitForSelector(containerSelector, { timeout: 5000 });

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
                    // console.log(articleTitle)

                    const articleLink = await article.$eval(link, el => el.href).catch(() => null);
                    // console.log(articleLink)

                    const articleImage = image ? await article.$eval(image, el => el.src).catch(() => null) : null;
                    // console.log(articleImage)
                    const articleDescription = description ? await article.$eval(description, el => el.textContent.trim()).catch(() => null) : null;
                    // console.log(articleDescription)


                    if (articleTitle || articleLink || articleImage || articleDescription) {
                        const articleData = {
                            title: articleTitle,
                            link: articleLink,
                            description: articleDescription,
                            image: articleImage,
                        };
                        // console.log(articleData)
                        const existingArticle = await englishArticle.findOne({ link: articleData.link })

                        if (!existingArticle) {

                            const newArticle = new englishArticle(articleData)
                            await newArticle.save()
                            // console.log('Saved article:', articleData);
                            scrapedData.push(articleData)

                        } else {

                            // console.log(`Article already exists: ${articleData.link}`);
                            // throw new errorHandler(400,`Article already exists: ${articleData.link}`)
                        }
                    }

                } catch (innerError) {
                    console.error("Error evaluating element:", innerError);
                }
            }
        }

        // console.log('Scraped Data:', scrapedData)
        await browser.close();
        return scrapedData

    } catch (error) {
        console.error("Error during scraping:", error);
        throw new errorHandler(501, "Error during scraping")
    }
}
)

