// hindi news

import puppeteer from "puppeteer";
import { errorHandler } from "../../utils/errorHandler.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { hindiBusiness } from "../../models/hindiMore.model.js";




export const scrapeHindi = asyncHandler(async (req, res) => {
    try {
        const browser = await puppeteer.launch({
           executablePath: 'C:/Users/LENOVO/.cache/puppeteer/chrome/win64-127.0.6533.88/chrome-win64/chrome.exe',executablePath: 'C:\Users\LENOVO\.cache\puppeteer\chrome\win64-127.0.6533.88\chrome-win64\chrome.exe', // executablePath: 'C:\\Users\\LENOVO\\.cache\\puppeteer\\chrome\\win64-127.0.6533.88\\chrome-win64\\chrome.exe',
            headless: true,
            defaultViewport: null,
            cacheDir: '/opt/render/.cache/puppeteer',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto('https://www.aajtak.in/business', { waitUntil: 'networkidle2' });

        const containerSelector = "div.content-area > div:nth-child(4)";

        const selectors = [
            {
                title: "li:nth-child(1) > a > div.text-area > h2",
                link: "li:nth-child(1) > a",
                image: "li:nth-child(1) > a > div.thumb > img",
                // description: "div.left-story > div.hhm-stoy-left-body > a > div:nth-child(3) > p"
            },
            {
                title: "li:nth-child(2) > a > div.text-area > h2",
                link: "li:nth-child(2) > a",
                image: "li:nth-child(2) > a > div.thumb > img",
                // description: "div.home-single-story > div.single_str > a > div.title > h3"
            },
            {
                title: "li:nth-child(3) > a > div.text-area > h2",
                link: "li:nth-child(3) > a",
                image: "li:nth-child(3) > a > div.thumb > img",
                // description: "li:nth-child(1) > a > div.title.title-bold > h3"
            },
            {
                title: "li:nth-child(4) > a > div.text-area > h2",
                link: "li:nth-child(4) > a",
                image: "li:nth-child(4) > a > div.thumb > img",
                // description: "li:nth-child(1) > a > div.title.title-bold > h3"
            },
            {
                title: "li:nth-child(5) > a > div.text-area > h2",
                link: "li:nth-child(5) > a",
                image: "li:nth-child(5) > a > div.thumb > img",
                // description: "li:nth-child(1) > a > div.title.title-bold > h3"
            },
            {
                title: "li:nth-child(6) > a > div.text-area > h2",
                link: "li:nth-child(6) > a",
                image: "li:nth-child(6) > a > div.thumb > img",
                // description: "li:nth-child(1) > a > div.title.title-bold > h3"
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


                        const existingArticle = await hindiBusiness.findOne({ link: articleData.link })

                        if (!existingArticle) {

                            const newArticle = new hindiBusiness(articleData)
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



