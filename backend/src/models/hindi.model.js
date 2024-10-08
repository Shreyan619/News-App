import mongoose from "mongoose";

const hindiArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        // required: true
    },
    link: {
        type: String,
        unique: true
    },
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    },
    description: {
        type: String,
        // required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "admin"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        // required: true
    },
    source: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Source',
        // required: true
    },
    author: {
        type: String,
        // required: true
    },
    publishedAt: {
        type: Date,
        // required: true
    },
    image: {
        type: String
    },
}, { timestamps: true })

export const hindiArticle = mongoose.model("Hindiarticle", hindiArticleSchema)