import puppeteer from "puppeteer";
import { errorHandler } from "../../utils/errorHandler.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { EnglishTech } from "../../models/englishTech.model.js";


export const scrapeEnglishTech = asyncHandler(async () => {
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
        await page.goto('https://abcnews.go.com/Technology', { waitUntil: 'networkidle2' });

        const containerSelector = "#bandlist-component > div.band__articleroll.band"

        const selectors = [
            {
                title: "section:nth-child(1) > div.ContentRoll__Headline > h2",
                link: "section:nth-child(1) > div.ContentRoll__Headline > h2 > a",
                image: "section:nth-child(1) > div.ContentRoll__Image > a > figure > div.Image__Wrapper.aspect-ratio--child > picture > img",
                description:"section:nth-child(1) > div.ContentRoll__Headline > div > div.ContentRoll__Desc"

            },
            {
                title: "section:nth-child(2) > div.ContentRoll__Headline > h2",
                link: "section:nth-child(2) > div.ContentRoll__Headline > h2 > a",
                image: "section:nth-child(2) > div.ContentRoll__Image > a > figure > div.Image__Wrapper.aspect-ratio--child > picture > img",
                description:"section:nth-child(2) > div.ContentRoll__Headline > div > div.ContentRoll__Desc"

            },
            {
                title: "section:nth-child(3) > div.ContentRoll__Headline > h2",
                link: "section:nth-child(3) > div.ContentRoll__Headline > h2 > a",
                image: "section:nth-child(3) > div.ContentRoll__Image > a > figure > div.Image__Wrapper.aspect-ratio--child > picture > img",
                description:"section:nth-child(3) > div.ContentRoll__Headline > div > div.ContentRoll__Desc"

            },
            {
                title: "section:nth-child(4) > div.ContentRoll__Headline > h2",
                link: "section:nth-child(4) > div.ContentRoll__Headline > h2 > a",
                image: "section:nth-child(4) > div.ContentRoll__Image > a > figure > div.Image__Wrapper.aspect-ratio--child > picture > img",
                description:"section:nth-child(4) > div.ContentRoll__Headline > div > div.ContentRoll__Desc"

            },
            {
                title: "section:nth-child(5) > div.ContentRoll__Headline > h2",
                link: "section:nth-child(5) > div.ContentRoll__Headline > h2 > a",
                image: "section:nth-child(5) > div.ContentRoll__Image > a > figure > div.Image__Wrapper.aspect-ratio--child > picture > img",
                description:"section:nth-child(5) > div.ContentRoll__Headline > div > div.ContentRoll__Desc"

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
                        const existingArticle = await EnglishTech.findOne({ link: articleData.link })

                        if (!existingArticle) {

                            const newArticle = new EnglishTech(articleData)
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
})