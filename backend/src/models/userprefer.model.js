import mongoose from "mongoose";

const userPreferenceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    sources: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Source'
    }],
    language: {
        type: String
    },
    notifications: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

export const userPreference = mongoose.model("userPreference", userPreferenceSchema)