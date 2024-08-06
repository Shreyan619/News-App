import { Router } from "express"
import { scrapeAajTak } from "../scrape/aajtak.scrape.js"

const article = Router()

article.get("/articleHindi/aajtak", scrapeAajTak)

export default article