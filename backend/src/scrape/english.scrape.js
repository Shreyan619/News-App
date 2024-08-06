// english newshttps://abcnews.go.com/Live

import puppeteer from "puppeteer";

export const scrapeEnglish = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
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

        console.log(`Waiting for selector: ${containerSelector}`);
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
                        scrapedData.push({
                            title: articleTitle,
                            link: articleLink,
                            description: articleDescription,
                            image: articleImage,
                        });
                    }

                } catch (innerError) {
                    console.error("Error evaluating element:", innerError);
                }
            }
        }

        // console.log(scrapedData);
        await browser.close();
    } catch (error) {
        console.error("Error during scraping:", error);
    }
};


scrapeEnglish();