import { User } from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const admin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    }
    else {
        throw new errorHandler('Not authorized as an admin', 403)
    }
})

export const isAuthenticated = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies?.accesstoken

        if (!token) {
            throw new errorHandler("Please Login to access this resource", 401);
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = await User.findById(decoded._id)

        if (!req.user) {
            throw new errorHandler("User not found", 404);
        }
        next();

    } catch (error) {
        console.error("Error in isAuthenticated middleware:", error);
        throw new errorHandler(401, "Not authenticated")
    }
})