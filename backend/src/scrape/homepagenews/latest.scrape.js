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
        await page.goto('https://www.ndtv.com/latest', { waitUntil: 'networkidle2' });

        const containerSelector = "body > div.content > div > div > section";

        const selectors = [
            {
                title: "div:nth-child(1) > div.news_Itm-cont > h2",
                link: "div:nth-child(1) > div.news_Itm-img > a",
                image: "div:nth-child(1) > div.news_Itm-img > a > img",
                description: "div:nth-child(1) > div.news_Itm-cont > p"
            },
            {
                title: "div:nth-child(2) > div.news_Itm-cont > h2",
                link: "div:nth-child(2) > div.news_Itm-img > a",
                image: "div:nth-child(2) > div.news_Itm-img > a > img",
                description: "div:nth-child(2) > div.news_Itm-cont > p"
            },
            {
                title: "div:nth-child(3) > div.news_Itm-cont > h2",
                link: "div:nth-child(3) > div.news_Itm-img > a",
                image: "div:nth-child(3) > div.news_Itm-img > a > img",
                description: "div:nth-child(3) > div.news_Itm-cont > p"
            },
            {
               title: "div:nth-child(6) > div.news_Itm-cont > h2",
                link: "div:nth-child(6) > div.news_Itm-img > a",
                image: "div:nth-child(6) > div.news_Itm-img > a > img",
                description: "div:nth-child(6) > div.news_Itm-cont > p"
            },
            {
                title: "div:nth-child(7) > div.news_Itm-cont > h2",
                link: "div:nth-child(7) > div.news_Itm-img > a",
                image: "div:nth-child(7) > div.news_Itm-img > a > img",
                description: "div:nth-child(7) > div.news_Itm-cont > p"
            },
            {
                title: "li:nth-child(8) > a > div.UreF0 > p.CRKrj",
                link: "li:nth-child(8) > a",
                image: "li:nth-child(8) > a > div.Ng0mw > div > img",
                description: "li:nth-child(8) > a > div.UreF0 > p.W4Hjm"
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



