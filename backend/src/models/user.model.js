import mongoose from "mongoose"
import validator from "validator"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"],
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Enter unique email"],
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        default: ["user", "admin"],
    },
    refreshToken: {
        type: String,
    },
    picture: {
        type: String,
        // required: true
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

}, { timestamps: true })

export const User = mongoose.model("User", userSchema)