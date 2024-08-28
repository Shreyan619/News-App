// hindi news

import puppeteer from "puppeteer";
import { LatestArticle } from "../../models/homepagemodel/latest.model.js"
import { errorHandler } from "../../utils/errorHandler.js";
import { asyncHandler } from "../../utils/asyncHandler.js";




export const scrapeLatest = asyncHandler(async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null
        });

        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto('https://timesofindia.indiatimes.com/news', { waitUntil: 'networkidle2' });

        const containerSelector = "div.YBHYk > div:nth-child(3) > div > div > div.QeV0F > div > ul";

        const selectors = [
            {
                title: "li:nth-child(1) > a > div.UreF0 > p.CRKrj",
                link: "li:nth-child(1) > a",
                image: "li:nth-child(1) > a > div.Ng0mw > div > img",
                description: "li:nth-child(1) > a > div.UreF0 > p.W4Hjm"
            },
            {
                title: "li:nth-child(2) > a > div.UreF0 > p.CRKrj",
                link: "li:nth-child(2) > a",
                image: "li:nth-child(2) > a > div.Ng0mw > div > img",
                description: "li:nth-child(2) > a > div.UreF0 > p.W4Hjm"
            },
            {
                title: "li:nth-child(4) > a > div.UreF0 > p.CRKrj",
                link: "li:nth-child(4) > a",
                image: "li:nth-child(4) > a > div.Ng0mw > div > img",
                description: "li:nth-child(4) > a > div.UreF0 > p.W4Hjm"
            },
            {
                title: "li:nth-child(3) > a > div.UreF0 > p.CRKrj",
                link: "li:nth-child(3) > a",
                image: "li:nth-child(3) > a > div.Ng0mw > div > img",
                description: "li:nth-child(3) > a > div.UreF0 > p.W4Hjm"
            },
            {
                title: "li:nth-child(5) > a > div.UreF0 > p.CRKrj",
                link: "li:nth-child(5) > a",
                image: "li:nth-child(5) > a > div.Ng0mw > div > img",
                description: "li:nth-child(5) > a > div.UreF0 > p.W4Hjm"
            },
            {
                title: "li:nth-child(6) > a > div.UreF0 > p.CRKrj",
                link: "li:nth-child(6) > a",
                image: "li:nth-child(6) > a > div.Ng0mw > div > img",
                description: "li:nth-child(6) > a > div.UreF0 > p.W4Hjm"
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


                        const existingArticle = await LatestArticle.findOne({ link: articleData.link })

                        if (!existingArticle) {

                            const newArticle = new LatestArticle(articleData)
                            await newArticle.save()
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

        // console.log(scrapedData);
        await browser.close();
        return scrapedData

    } catch (error) {
        console.error("Error during scraping:", error);
        throw new errorHandler(501, "Error during scraping")
    }
});



