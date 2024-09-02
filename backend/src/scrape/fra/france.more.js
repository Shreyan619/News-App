// french news https://www.france24.com/fr/

import puppeteer from "puppeteer";
import { errorHandler } from "../../utils/errorHandler.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { FranceTech } from "../../models/franceMore.model.js";



export const scrapeFranceMore = asyncHandler(async () => {
    try {
        const browser = await puppeteer.launch({
            // executablePath: 'C:\\Users\\LENOVO\\.cache\\puppeteer\\chrome\\win64-127.0.6533.88\\chrome-win64\\chrome.exe',
            headless: true,
            defaultViewport: null
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        await page.goto('https://www.lexpress.fr/economie/', { waitUntil: 'networkidle2' });

        const containerSelector = "#fusion-app > div.sous-home";

        const selectors = [
            {
                title: "article:nth-child(1) > div.thumbnail__text__wrapper > div > div.thumbnail__title.headline--lg > a > h2",
                link: "article:nth-child(1) > div.thumbnail__text__wrapper > div > div.thumbnail__title.headline--lg > a",
                image: "article:nth-child(1) > div.thumbnail__image.link--unstyled > a > picture > img",
                description: "article:nth-child(1) > div.thumbnail__text__wrapper > div > div.thumbnail__description"
            },
            {
                title: "article:nth-child(2) > div.thumbnail__text__wrapper > div > div.thumbnail__title.headline--lg > a > h2",
                link: "article:nth-child(2) > div.thumbnail__text__wrapper > div > div.thumbnail__title.headline--lg > a",
                image: "article:nth-child(2) > div.thumbnail__image.link--unstyled > a > picture > img",
                description: "article:nth-child(2) > div.thumbnail__text__wrapper > div > div.thumbnail__description"
            },
            {
                title: "article:nth-child(3) > div.thumbnail__text__wrapper > div > div.thumbnail__title.headline--lg > a > h2",
                link: "article:nth-child(3) > div.thumbnail__text__wrapper > div > div.thumbnail__title.headline--lg > a",
                image: "article:nth-child(3) > div.thumbnail__image.link--unstyled > a > picture > img",
                description: "article:nth-child(3) > div.thumbnail__text__wrapper > div > div.thumbnail__description"
            },
            {
                title: "article:nth-child(6) > div.thumbnail__text__wrapper > div > div.thumbnail__title.headline--lg > a > h2",
                link: "article:nth-child(6) > div.thumbnail__text__wrapper > div > div.thumbnail__title.headline--lg > a",
                image: "article:nth-child(6) > div.thumbnail__image.link--unstyled > a > picture > img",
                description: "article:nth-child(6) > div.thumbnail__text__wrapper > div > div.thumbnail__description"
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

                        const existingArticle = await FranceTech.findOne({ link: articleData.link })

                        if (!existingArticle) {

                            const newArticle = new FranceTech(articleData)
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



