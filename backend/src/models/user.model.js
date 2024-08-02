import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"

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
        enum: ["user", "admin"],
        default: "user"
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


userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})


userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema)