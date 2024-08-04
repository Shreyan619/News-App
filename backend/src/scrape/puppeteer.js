import puppeteer from "puppeteer";

export const scrapeArticles = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null
        });

        const page = await browser.newPage();
        const navigationPromise = page.waitForNavigation({waitUntil: "domcontentloaded"});
        await page.setDefaultNavigationTimeout(0)
        await page.goto('https://www.aajtak.in/',{waitUntil:'networkidle2'});

        const selectors = [
            {
                container: ".hhm-stoy-left-body",
                title: "a",
                link: "a",
                description1: "a > div:nth-child(1) > h2",
                image: "a > div.thumb > img",
                description2: "a > div:nth-child(3) > p"
            },
            // {
            //     container: "",
            //     title: "",
            //     link: "",
            //     description: ""
            // },
            // {
            //     container: "",
            //     title: "",
            //     link: "",
            //     description: ""
            // },
            // {
            //     container: "",
            //     title: "",
            //     link: "",
            //     description: ""
            // },
        ]

        const scrapedData = []

        for (const { container, title, link, description1, image, description2 } of selectors) {
            try {
                console.log(`Waiting for selector: ${container}`);
                await page.waitForSelector(container, { timeout: 5000 });

                const articles = await page.$$(container);

                for (const article of articles) {
                    try {
                        const isAttached = await page.evaluate(el => el.isConnected, article);
                        if (!isAttached) {
                            console.log("Article element is detached, skipping...");
                            continue;
                        }

                        const articleTitle = await article.$eval(title, el => el.getAttribute('title'));

                        const articleLink = await article.$eval(link, el => el.href);

                        const articleDescription1 = await article.$eval(description1, el => el.textContent.trim());

                        const articleImage = await article.$eval(image, el => el.src);
                        
                        const articleDescription2 = await article.$eval(description2, el => el.textContent.trim());

                        scrapedData.push({
                            title: articleTitle,
                            link: articleLink,
                            description1: articleDescription1,
                            image: articleImage,
                            description2: articleDescription2,
                        });

                    } catch (innerError) {
                        console.error("Error evaluating element:", innerError);
                    }
                }
                    
                } catch(outerError){
                    console.log(`Error processing container ${container}:`,outerError)
                }
            }
            console.log(scrapedData)
            await browser.close()
        }

     catch (error) {
        console.error("Error during scraping:", error);
    }
};

// Ensure the function is called
scrapeArticles();
