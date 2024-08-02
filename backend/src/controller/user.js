import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { errorHandler } from "../utils/errorHandler.js"
import { apiResponse } from "../utils/apiResponse.js";
import { genAccessToken, genRefreshToken } from "../utils/token.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
        throw new errorHandler(400, "no refresh token provided")
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decoded.id)

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