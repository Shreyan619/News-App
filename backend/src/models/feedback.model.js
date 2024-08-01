import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        //    required: true 
    },
    message: {
        type: String,
        required: true
    },
}, { timestamps: true });

export const feedback = ("Feedback", feedbackSchema)