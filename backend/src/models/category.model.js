import mongoose, { Mongoose } from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    }
}, { timestamps: true })

export const category = mongoose.model("Category", categorySchema)