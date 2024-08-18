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
import { bucket } from "../firebase/firebase-admin.js";
import { v4 as uuidv4 } from "uuid"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

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

    const { name, email, password, provider = 'local' } = req.body
    const picture = req.file

    if (![name, email, password] || (provider !== 'google' && !password)) {
        throw new errorHandler(401, "Please provide all the fields")
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { name }]
    })
    if (existingUser) {
        throw new errorHandler(401, "User with email or name exists")
    }

    const userData = ({
        name: name.toLowerCase(),
        email,
        provider,
    })

    if (provider !== 'google') {
        userData.password = password;
    }

    if (picture) {
        const fileName = `{uuidv4()}_${picture.originalname}`
        const fileUpload = bucket.file(fileName)

        await fileUpload.save(picture.buffer, {
            metadata: {
                contentType: picture.mimeyype
            }
        })

        const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        userData.picture = fileUrl
    }

    const newUser = await User.create(userData)

    if (!newUser) {
        throw new errorHandler(500, "Something went wrong while registering the user")
    }
    return res.status(201).json(
        new apiResponse(200, newUser, "User registered Successfully")
    )
})

export const loginUser = asyncHandler(async (req, res) => {

    const { name, email, password, provider } = req.body


    if (!email) {
        throw new errorHandler(401, "email required")
    }

    if (provider !== 'google' && !password) {
        throw new errorHandler(401, "Password is required for non-Google logins");
    }

    let findUser = await User.findOne({ email })
    if (!findUser) {

        if (provider === 'google') {
            findUser = await User.create({ name, email, provider });
        } else {
            throw new errorHandler(404, "User does not exist");
        }
    } else {
        if (provider === 'google') {

            return res.status(200)
                .json(new apiResponse(200, findUser, "Logged in successfully via Google"));
        }
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

    const isPasswordValid = await findUser.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new errorHandler(400, 'Invalid password');
    }

    return res
        .status(200)
        .cookie("accesstoken", accessToken, options)
        .cookie("refreshtoken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                { accessToken, refreshToken, findUser },
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
    try {
        const { articleId } = req.params;
        const { articlemodel } = req.body;

        if (!articleId || !articlemodel) {
            throw new errorHandler(400, "Article ID and article model are required");
        }

        if (!mongoose.Types.ObjectId.isValid(articleId)) {
            throw new errorHandler(400, "Invalid article ID format.");
        }

        const user = req.user._id;

        const articleModel = articleModels[articlemodel];
        // console.log(articleModel)

        if (!articleModel) {
            throw new errorHandler(400, "Invalid article model");
        }

        const articleExist = await articleModel.findById(articleId);
        if (!articleExist) {
            throw new errorHandler(404, "Article not found");
        }

        const existingBookmark = await bookmark.findOne({ userId: user, articleId, articlemodel });

        if (existingBookmark) {
            throw new errorHandler(400, "Article is already bookmarked");
        }

        const newBookmark = new bookmark({
            userId: user,
            articleId,
            articlemodel,
            title: articleExist.title,
            image: articleExist.image,
            link: articleExist.link
        });

        await newBookmark.save();

        return res.status(201)
            .json(new apiResponse(201, "Article bookmarked successfully", newBookmark));
    } catch (error) {
        console.error("Error in bookmarkArticle:", error);
        throw new errorHandler(500, "Error bookmarking article", error.message);
    }
});

export const removeBookmark = asyncHandler(async (req, res) => {
    try {
        const { articleId } = req.params
        const { articlemodel } = req.body;
        const userId = req.user._id;

        if (!articleId || !articlemodel) {
            throw new errorHandler(400, "ArticleId required");
        }

        if (!mongoose.Types.ObjectId.isValid(articleId)) {
            throw new errorHandler(400, "Invalid article ID format.");
        }
        const existingBookmark = await bookmark.findOne({ userId, articleId, articlemodel });
        if (!existingBookmark) {
            throw new errorHandler(404, 'Bookmark not found');
        }

        await bookmark.deleteOne({ userId, articleId, articlemodel })

        return res.status(200)
            .json(new apiResponse(200, "Bookmark removed successfully"))
    } catch (error) {
        console.error(error.message)
        throw new errorHandler(501, "error removing bookmark", error.message)
    }
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

export const moveBookmarkedArticlesToBookmarkModel = asyncHandler(async (req, res) => {
    try {
        const cutOffDate = new Date(Date.now() - 10 * 60 * 1000);

        const bookmarkedArticles = await bookmark.find().distinct('articleId')

        const moveArticles = async (articleModelName) => {
            const articleModel = articleModels[articleModelName]

            if (!articleModel) {
                console.error(`No article model found for ${articleModelName}`)
            }

            const articlesToMove = await articleModel.find({ _id: { $in: bookmarkedArticles } })

            const bookmarkPromises = articlesToMove.map(async (article) => {
                await bookmark.updateOne({
                    userId: article.userId,
                    articleId: article._id,
                    articlemodel: articleModelName
                },
                    {
                        title: article.title,
                        image: article.image,
                        link: article.link,
                        description: article.description
                    },

                    {
                        upsert: true
                    })
            })
            await Promise.all(bookmarkPromises);

            await articleModel.deleteMany({ _id: { $in: bookmarkedArticles } })
        }
        await moveArticles('Englisharticle')
        await moveArticles('Frencharticle');
        await moveArticles('Spanisharticle');
        await moveArticles('Hindiarticle');

        console.log("Bookmarked articles moved to bookmark model and deleted from language models");


    } catch (error) {
        console.error("Error moving bookmarked articles:", error.message);
        throw new errorHandler(500, "Error moving bookmarked articles:", error.message);
    }
})

export const updateRole = asyncHandler(async (req, res) => {

    const { userId } = req.params
    const { role } = req.body

    if (!['user', 'admin'].includes(role)) {
        throw new errorHandler(400, 'Invalid role');
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

    if (!user) {
        throw new errorHandler(404, 'User not found');
    }

    return res
        .status(200)
        .json(new apiResponse(200, user, "User role updated successfully"))
})

// export const googleLogin = asyncHandler(async (req, res) => {
//     const { email, name } = req.body

//     let user = await User.findOne({ email });

//     if (!user) {
//         user = await User.create({ email, name, provider: 'google' });
//     } else if (user.provider !== 'google') {
//         throw new errorHandler(400, 'User already exists with a different login method.');
//     }

//     res.status(200)
//         .json(new apiResponse(200, "logged in succesfully", user))
// })