import puppeteer from "puppeteer";

export const scrapeArticles = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        await page.goto('https://www.aajtak.in/', { waitUntil: 'networkidle2' });

        const containerSelector = "#badi_khabar_1"; // Define the container selector once

        const selectors = [
            {
                title: "a > div:nth-child(1) > h2",
                link: "a",
                image: "a > div.thumb > img",
                description: "a > div:nth-child(3) > p"
            },
            {
                title: "div > h3 > a",
                link: "div > h3 > a",
                image:"div.thumb.video_asso > img",
                description:"div.single_str > a > div.title > h3"
            },
            // Add more selectors as needed
        ];

        const scrapedData = []

        console.log(`Waiting for selector: ${containerSelector}`);
        await page.waitForSelector(containerSelector, { timeout: 10000 }); // Increased timeout for selector

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


                    // Check if at least one necessary field is not null before pushing to scrapedData
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

// Ensure the function is called
scrapeArticles();
