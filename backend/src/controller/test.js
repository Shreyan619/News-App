import { asyncHandler } from "../utils/asyncHandler.js"

export const testing = asyncHandler(async (req, res) => {
    try {
        res.status(200).json("Success")
    } catch (error) {
        console.error(error.message)
        res.status(500).json("failed", 500, error)
    }
})