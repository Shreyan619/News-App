import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    source: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Source',
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publishedAt: {
        type: Date,
        required: true
    },
    imageUrl: {
        type: String
    },
}, { timestamps: true })

export const article = mongoose.model("Article", articleSchema)