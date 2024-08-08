import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    articlemodel: {
        type: String,
        enum: ["Englisharticle", "Spanisharticle", "Frencharticle", "Hindiarticle"],
        required: true
    }
}, { timestamps: true });

export const bookmark = mongoose.model("Bookmark", bookmarkSchema)
