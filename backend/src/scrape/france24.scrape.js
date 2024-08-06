// french news https://www.france24.com/fr/

import puppeteer from "puppeteer";

export const scrapeFrance = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        await page.goto('https://www.france24.com/fr/', { waitUntil: 'networkidle2' });

        const containerSelector = "#main-content > div:nth-child(2) > div";

        const selectors = [
            {
                title: "div.article__title > a > h2",
                link: "div.article__title > a",
                image: "figure > picture > img",

            },
            {
                title: "div:nth-child(2) > div > div > div > div.article__title > a > h2",
                link: "div:nth-child(2) > div > div > div > div.article__title > a",
                image: "div:nth-child(2) > div > div > a > figure > picture > img",

            },
            {
                title: "div:nth-child(3) > div > div > div > div.article__title > a > h2",
                link: "div:nth-child(3) > div > div > div > div.article__title > a",
                image: "div:nth-child(3) > div > div > a > figure > picture > img",

            },
            {
                title: "div:nth-child(4) > div > div > div > div.article__title > a > h2",
                link: "div:nth-child(4) > div > div > div > div.article__title > a",
                image: "div:nth-child(4) > div > div > a > figure > picture > img",

            },
            {
                title: "div:nth-child(5) > div > div > div > div.article__title > a > h2",
                link: "div:nth-child(5) > div > div > div > div.article__title > a",
                image: "#div:nth-child(5) > div > div > a > figure > picture > img",

            },
            {
                title: "div:nth-child(6) > div > div > div > div.article__title > a > h2",
                link: "div:nth-child(6) > div > div > div > div.article__title > a",
                image: "div:nth-child(6) > div > div > a > figure > picture > img",

            },



        ];

        const scrapedData = []

        console.log(`Waiting for selector: ${containerSelector}`);
        await page.waitForSelector(containerSelector, { timeout: 4000 });

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


scrapeFrance();