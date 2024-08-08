import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { errorHandler } from "../utils/errorHandler.js"
import { apiResponse } from "../utils/apiResponse.js";
import { genAccessToken, genRefreshToken } from "../utils/token.js"
import { bookmark } from "../models/bookmark.model.js";
import { englishArticle } from "../models/english.model.js"
import { spanishArticle } from "../models/spanish.model.js"
import { frenchArticle } from "../models/french.model.js"
import { hindiArticle } from "../models/hindi.model.js"
import jwt from "jsonwebtoken"

const articleModels = {
    Englisharticle: englishArticle,
    Frencharticle: frenchArticle,
    Spanisharticle: spanishArticle,
    Hindiarticle: hindiArticle
}

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
        throw new errorHandler(400, "no refresh token provided")
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decoded._id)

        if (!user || !user.refreshToken !== refreshToken) {
            throw new errorHandler(403, "invalid refresh token ")
        }

        const newAccessToken = genAccessToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", newAccessToken, { httpOnly: true })
            .json(new apiResponse(200, { accessToken: newAccessToken },
                "Access token refreshed successfully"))
    } catch (error) {
        throw new errorHandler('Invalid refresh token', 403);
    }
})

export const createUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body

    if (![name, email, password]) {
        throw new errorHandler(401, "Please provide all the fields")
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { name }]
    })
    if (existingUser) {
        throw new errorHandler(401, "User with email or name exists")
    }

    const newUser = await User.create({
        name: name.toLowerCase(),
        email,
        password,
    })
    if (!newUser) {
        throw new errorHandler(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new apiResponse(200, newUser, "User registered Successfully")
    )
})

export const loginUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body

    if (!(name || email)) {
        throw new errorHandler(401, "username or email required")
    }

    const findUser = await User.findOne({
        $or: [{ name }, { email }]
    })
    if (!findUser) {
        throw new errorHandler(404, "user does not exist")
    }

    // Generate tokens
    const accessToken = genAccessToken(findUser._id)
    const refreshToken = genRefreshToken(findUser._id)

    findUser.refreshToken = refreshToken
    await findUser.save()

    const options = {
        httpOnly: true,
        secure: true
    }

    const isPasswordValid = await findUser.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new errorHandler(404, "password incorrect")
    }

    return res
        .status(200)
        .cookie("accesstoken", accessToken, options)
        .cookie("refreshtoken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                { accessToken, refreshToken },
                "User logged In Successfully"
            )
        )
})

export const logoutUser = asyncHandler(async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: undefined // this removes the field from document
                }
            },
            {
                new: true
            }
        )

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .status(200)
            .json(new apiResponse(200, {},
                "User logged out successfully"
            ))
    } catch (error) {
        console.log(error.message)
        return res
            .status(500)
            .json(new apiResponse(500, error.message));
    }
})

export const bookmarkArticle = asyncHandler(async (req, res) => {
    const { articleId, articlemodel } = req.body

    if (!articleId || !articlemodel) {
        throw new errorHandler(400, "aricleid and language required")
    }

    const user = req.user._id
    const articleModel = articleModels[articlemodel]

    if (!articleModel) {
        throw new errorHandler(400, 'Invalid article model');
    }

    const articleExist = await articleModel.findById(articleId)
    if (!articleExist) {
        throw new errorHandler(404, 'Article not found');
    }

    const existingBookmark = await bookmark.findOne({ userId: user, articleId, articlemodel })

    if (existingBookmark) {
        throw new errorHandler(400, 'Article is already bookmarked');
    }

    const newBoomark = new bookmark({
        userId: user,
        articleId,
        articlemodel,
        title: articleExist.title,
        image: articleExist.image,
        link: articleExist.link,
        image: articleExist.image,
    })

    await newBoomark.save()

    return res.status(201)
        .json(new apiResponse(201, "Article bookmarked successfully"))
})

export const removeBookmark = asyncHandler(async (req, res) => {
    const { articleId, articlemodel } = req.body;
    const userId = req.user._id;

    if (!articleId || !articlemodel) {
        throw new errorHandler(400, "ArticleId and language required");
    }

    const existingBookmark = await bookmark.findOne({ userId, articleId, articlemodel });
    if (!existingBookmark) {
        throw new errorHandler(404, 'Bookmark not found');
    }

    await bookmark.deleteOne({ userId, articleId, articlemodel })

    return res.status(200)
        .json(new apiResponse(200, "Bookmark removed successfully"))
})

export const getAllBookmark = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const userBookmarks = await bookmark.find({ userId })
    console.log(userBookmarks)

    if (!userBookmarks.length) {
        return res.status(404).json(new apiResponse(404, "No bookmarks found for the user"));
    }

    return res.status(200)
        .json(new apiResponse(200, userBookmarks, "Bookmarks retrieved successfully"));
})