import { Router } from "express";
import {
    createUser,
    loginUser,
    logoutUser,
    refreshAccessToken
} from "../controller/user.js"
import { isAuthenticated } from "../middleware/auth.js";

const user = Router()

user.post("/user/create", createUser)
user.post("/user/login", loginUser)
// user.post("/user/refreshtoken", refreshAccessToken)
user.get("/user/logout", isAuthenticated, logoutUser)

export default user