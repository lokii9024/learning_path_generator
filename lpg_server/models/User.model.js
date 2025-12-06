import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatarUrl: {
        type: String,
        default: ""
    },
    callsForCreatePath: {
        type: Number,
        default: 0
    },
    isPremium:{
        type: Boolean,
        default: false
    },
    premiumSince:{
        type: Date,
        default: null
    }
},{
    timestamps: true
})

export const User = mongoose.model("User", userSchema);