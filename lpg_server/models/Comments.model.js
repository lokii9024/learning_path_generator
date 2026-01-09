import mongoose from "mongoose";

const CommentsScehma = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    communityPathId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
        required: true,
        index: true
    },
    commentText: {
        type: String,
        required: true,
    }
},{ timestamps: true });

export const Comment = mongoose.model("Comment", CommentsScehma);