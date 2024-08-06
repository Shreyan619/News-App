import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import user from "./routes/user.routes.js";
import article from "../src/routes/article.routes.js"

const app = express()
dotenv.config()

app.use(cors({
  origin: `https://${process.env.HOST}`,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))



app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(cookieParser())

// routes declaration
app.use("/api/v1", user)
app.use("/api/v1", article)


export { app }