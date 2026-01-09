import mongoose from "mongoose";

const UpvoteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    communityPathId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
        required: true,
        index: true
    },
}, { timestamps: true, _id: false });

UpvoteSchema.index({ userId: 1, communityPathId: 1 }, { unique: true });

export const Upvote = mongoose.model("Upvote", UpvoteSchema);