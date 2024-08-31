import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    articlemodel: {
        type: String,
        enum: [
            "Englisharticle", "Spanisharticle", "Frencharticle", "Hindiarticle",
            "EnglishTech", "FranceTech", "spainsport", "Hindibusiness","Latest"
        ],
        required: true
    },
    title: {
        type: String
    },
    link: {
        type: String
    },
    image: {
        type: String
    },
    description: {
        type: String
    }
}, { timestamps: true });

export const bookmark = mongoose.model("Bookmark", bookmarkSchema)
