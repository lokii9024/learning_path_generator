import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    duration: String, // e.g., "2 weeks", "1 month"
    videos: [
    {
      title: String,
      channel: String,
      thumbnail: String,
      url: String,
      publishedAt: String,
    },
    ],
    repos: [
        {
        name: String,
        description: String,
        url: String,
        stars: Number,
        language: String,
        owner: String,
        },
    ],
    isCompleted: {
        type: Boolean,
        default: false
    }
})

const learningPathSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    goal: {
        type: String,
        required: true
    },
    modules: [moduleSchema],
    completedModules: {
        type: Number,
        default: 0
    },
    totalModules: {
        type: Number,
        default: 0
    },
    skillLevel: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        default: "Beginner",
        required: true
    },
    duration: {
        type: String,
        required: true
    }, //e.g., "3 months"
    dailyTimeCommitment: {
        type: String, //hrs per day
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
},{
    timestamps:true
});

export const LearningPath = mongoose.model("LearningPath", learningPathSchema);
