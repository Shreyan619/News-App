import { Router } from "express";
import {
    bookmarkArticle,
    createUser,
    getAllBookmark,
    loginUser,
    logoutUser,
    refreshAccessToken,
    removeBookmark
} from "../controller/user.js"
import { isAuthenticated } from "../middleware/auth.js";

const user = Router()

user.post("/user/create", createUser)
user.post("/user/login", loginUser)
// user.post("/user/refreshtoken", refreshAccessToken)
user.get("/user/logout", isAuthenticated, logoutUser)
user.post("/article/:articleId/user/bookmark", isAuthenticated, bookmarkArticle)
user.delete("/article/:articleId/user/bookmark/remove", isAuthenticated, removeBookmark)
user.get("/user/bookmarks", isAuthenticated, getAllBookmark)

export default user