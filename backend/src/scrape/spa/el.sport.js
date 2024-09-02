// spanish news

import puppeteer from "puppeteer";
import { errorHandler } from "../../utils/errorHandler.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { SpainSport } from "../../models/spanishSport.model.js";



export const scrapeElSport = asyncHandler(async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            // executablePath: 'C:\\Users\\LENOVO\\.cache\\puppeteer\\chrome\\win64-127.0.6533.88\\chrome-win64\\chrome.exe',
            headless: true,
            defaultViewport: null,
            cacheDir: '/opt/render/.cache/puppeteer',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        await page.goto('https://www.deutschland.de/de/topic/leben', { waitUntil: 'networkidle2' });

        const containerSelector = "#main";

        const selectors = [
            {
                title: "div:nth-child(1) > div > div > div.col.col-md-4 > a > div.article-teaser-big__headline",
                link: "div:nth-child(1) > div > div > div.col.col-md-4 > a",
                image: "div:nth-child(1) > div > div > div.col.col-md-8 > a > picture > img",
                description: "div:nth-child(1) > div > div > div.col.col-md-4 > a > div.article-teaser-big__summary"
            },
            {
                title: "div:nth-child(2) > div > div > div > a.teaser-small__content > div.teaser-small__headline",
                link: "div:nth-child(2) > div > div > div > a.teaser-small__content",
                image: "div:nth-child(2) > div > div > div > a.teaser-small__image > picture > img",
                description: "div:nth-child(2) > div > div > div > a.teaser-small__content > div.teaser-small__summary"
            },
            {
                title: "div:nth-child(3) > div > div > div > a.teaser-small__content > div.teaser-small__headline",
                link: "div:nth-child(3) > div > div > div > a.teaser-small__content",
                image: "div:nth-child(3) > div > div > div > a.teaser-small__image > picture > img",
                description: "div:nth-child(3) > div > div > div > a.teaser-small__content > div.teaser-small__summary"
            },
            {
                title: "div:nth-child(4) > div > div > div > a.teaser-small__content > div.teaser-small__headline",
                link: "div:nth-child(4) > div > div > div > a.teaser-small__content",
                image: "div:nth-child(4) > div > div > div > a.teaser-small__image > picture > img",
                description: "div:nth-child(4) > div > div > div > a.teaser-small__content > div.teaser-small__summary"
            },
            {
                title: "div:nth-child(5) > div > div > div.col.col-md-4 > a > div.article-teaser-big__headline",
                link: "div:nth-child(5) > div > div > div.col.col-md-4 > a",
                image: "div:nth-child(5) > div > div > div.col.col-md-8 > a > picture > img",
                description: "div:nth-child(5) > div > div > div.col.col-md-4 > a > div.article-teaser-big__summary"
            },


        ];

        const scrapedData = []

        // console.log(`Waiting for selector: ${containerSelector}`);
        await page.waitForSelector(containerSelector, { timeout: 10000 });

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

                        const existingArticle = await SpainSport.findOne({ link: articleData.link })

                        if (!existingArticle) {

                            const newArticle = new SpainSport(articleData)
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


