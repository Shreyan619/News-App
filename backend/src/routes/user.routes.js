import { Router } from "express";
import {
    bookmarkArticle,
    createUser,
    getAllBookmark,
    // googleLogin,
    loginUser,
    logoutUser,
    refreshAccessToken,
    removeBookmark,
    updateRole
} from "../controller/user.js"
import { checkAdmin, isAuthenticated } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const user = Router()

user.post("/user/create", upload.single('picture'), createUser)
user.post("/user/login", loginUser)
// user.post("/user/refreshtoken", refreshAccessToken)
user.get("/user/logout", isAuthenticated, logoutUser)
user.post("/article/:articleId/user/:userId/bookmark", isAuthenticated, bookmarkArticle)
user.delete("/article/:articleId/user/:userId/bookmark/remove", isAuthenticated, removeBookmark)
user.put("/user/:userId/role", isAuthenticated, updateRole)
user.get("/user/:userId/bookmarks", isAuthenticated, checkAdmin, getAllBookmark)
// user.post("/user/google-login", googleLogin)

export default user