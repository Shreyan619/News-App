import mongoose from "mongoose";

const sourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    // url: { 
    //     type: String,
    //      required: true,
    //       unique: true },
},
    { timestamps: true });

export const source = mongoose.model("Source", sourceSchema)
