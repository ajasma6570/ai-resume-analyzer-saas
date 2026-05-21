import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    subscription: {
        type: String,
        enum: ["free", "premium"],
        default: "free",
    },
    avatar: {
        type: String,
        default: "",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
        default: "",
    },
    lastLogin: {
        type: Date,
    },
}, {
    timestamps: true,
})


const User = mongoose.model("User", userSchema);

export default User;