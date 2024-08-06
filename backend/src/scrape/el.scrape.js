// spanish news

import puppeteer from "puppeteer";

export const scrapeEl = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        await page.goto('https://elpais.com/us/?ed=us', { waitUntil: 'networkidle2' });

        const containerSelector = "body > main > div.z.z-hi";

        const selectors = [
            {
                title: "header > h2",
                link: "figure > a",
                image: "figure > a > img",
                description: "article > p"
            },
            {
                title: "article:nth-child(1) > header > h2",
                link: "article:nth-child(1) > header > h2 > a",
                image: "",
                description: "article:nth-child(1) > p"
            },
            {
                title: "li:nth-child(1) > a",
                link: "article.c.c-d.c--m > header > h2 > a",
                image: "article.c.c-d.c--m > figure > a > img",
                // description: ""
            },
            {
                title: "article.c.c-d.c--m-n > header > h2",
                link: "article.c.c-d.c--m-n > header > h2 > a",
                // image: "",
                // description: " article.c.c-d.c--m-n > ul > li > a > span"
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

        console.log(scrapedData);
        await browser.close();
    } catch (error) {
        console.error("Error during scraping:", error);
    }
};


scrapeEl();