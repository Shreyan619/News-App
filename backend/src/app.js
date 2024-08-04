import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import user from "./routes/user.routes.js";
import { scrapeArticles } from "./scrape/puppeteer.js";

const app = express()
dotenv.config()

app.use(cors({
    origin: `https://${process.env.HOST}`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

app.get("/scrape", async (req, res) => {
    try {
      await scrapeArticles();
      res.send("Scraping completed");
    } catch (error) {
      console.error("Error during scraping:", error);
      res.status(500).send("Scraping failed");
    }
  });

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(cookieParser())

// routes declaration
app.use("/api/v1",user)


export { app }