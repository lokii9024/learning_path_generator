import mongoose from "mongoose";

const progressTrackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    learningPath: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LearningPath",
        required: true
    },
    completedModules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "LearningPath.modules"
    }],
    lastAccessed: {
        type: Date,
        default: Date.now,
    },
    percentageCompleted:{
        type: Number,
        default: 0,
    }
},{
    timestamps:true
})

export const ProgressTrack = mongoose.model("ProgressTrack", progressTrackSchema);