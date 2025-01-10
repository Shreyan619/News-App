// hindi news

import puppeteer from "puppeteer";
import { LatestArticle } from "../../models/homepagemodel/latest.model.js"
import { errorHandler } from "../../utils/errorHandler.js";
import { asyncHandler } from "../../utils/asyncHandler.js";




export const scrapeLatest = asyncHandler(async (req, res, next) => {
    try {
        const browser = await puppeteer.launch({
            // executablePath: 'C:/Users/LENOVO/.cache/puppeteer/chrome/win64-127.0.6533.88/chrome-win64/chrome.exe',
            headless: true,
            defaultViewport: null,
            // cacheDir: '/opt/render/.cache/puppeteer',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto('https://www.ndtv.com/latest', { waitUntil: 'networkidle2' });

        const containerSelector = "body > div.vjl-cnt > div > div > div > div:nth-child(1) > article > div > div > div";

        const selectors = [
            {
                title: "li:nth-child(1) > div > div > div > h2", // 1
                link: "li:nth-child(1) > div > div > div > h2 > a",
                image: "li:nth-child(1) > div > a > div > img",
                description: "li:nth-child(1) > div > div > div > p"
            },
            {
                title: "li:nth-child(3) > div > div > div > h2",  //2
                link: "li:nth-child(3) > div > div > div > h2 > a",
                image: "li:nth-child(3) > div > a > div > img",
                description: "li:nth-child(3) > div > div > div > p"
            },
            {
                title: "li:nth-child(4) > div > div > div > h2", //3
                link: "li:nth-child(4) > div > div > div > h2 > a",
                image: "li:nth-child(4) > div > a > div > img",
                description: "li:nth-child(4) > div > div > div > p"
            },
            {
                title: "li:nth-child(5) > div > div > div > h2", //4
                link: "li:nth-child(5) > div > div > div > h2 > a",
                image: "li:nth-child(5) > div > a > div > img",
                description: "li:nth-child(5) > div > div > div > p"
            },
            {
                title: "li:nth-child(8) > div > div > div > h2", //5
                link: "li:nth-child(8) > div > div > div > h2 > a",
                image: "li:nth-child(8) > div > a > div > img",
                description: "li:nth-child(8) > div > div > div > p"
            },
            {
                title: "li:nth-child(9) > div > div > div > h2", //6
                link: "li:nth-child(9) > div > div > div > h2 > a",
                image: "li:nth-child(9) > div > a > div > img",
                description: "li:nth-child(9) > div > div > div > p"
            },
            {
                title: "li:nth-child(11) > div > div > div > h2", //7
                link: "li:nth-child(11) > div > div > div > h2 > a",
                image: "li:nth-child(11) > div > a > div > img",
                description: "li:nth-child(11) > div > div > div > p"
            },
            {
                title: "li:nth-child(12) > div > div > div > h2", //8
                link: "li:nth-child(12) > div > div > div > h2 > a",
                image: "li:nth-child(12) > div > a > div > img",
                description: "li:nth-child(12) > div > div > div > p"
            },
            {
                title: "li:nth-child(13) > div > div > div > h2", //9
                link: "li:nth-child(13) > div > div > div > h2 > a",
                image: "li:nth-child(13) > div > a > div > img",
                description: "li:nth-child(13) > div > div > div > p"
            },
            {
                title: "li:nth-child(14) > div > div > div > h2", //10
                link: "li:nth-child(14) > div > div > div > h2 > a",
                image: "li:nth-child(14) > div > a > div > img",
                description: "li:nth-child(14) > div > div > div > p"
            },
            {
                title: "li:nth-child(15) > div > div > div > h2", //11
                link: "li:nth-child(15) > div > div > div > h2 > a",
                image: "li:nth-child(15) > div > a > div > img",
                description: "li:nth-child(15) > div > div > div > p"
            },
            {
                title: "li:nth-child(16) > div > div > div > h2", //12
                link: "li:nth-child(16) > div > div > div > h2 > a",
                image: "li:nth-child(16) > div > a > div > img",
                description: "li:nth-child(16) > div > div > div > p"
            },



        ];

        const scrapedData = []

        // console.log(`Waiting for selector: ${containerSelector}`);
        await page.waitForSelector(containerSelector);
        // await page.waitForSelector(containerSelector, { timeout: 5000 });

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
        next(error)
        throw new errorHandler(501, "Error during scraping")
    }
});



