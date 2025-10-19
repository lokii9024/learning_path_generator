import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
    title: String,
    url: String,
    platform: String // e.g., "YouTube", "Coursera", "Udemy"
})

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
    resources: [resourceSchema],
    completed: {
        type: Boolean,
        default: false
    }
})

const learningPathSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    goal: {
        type: String,
        required: true
    },
    modules: [moduleSchema],
    skillLevel: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        default: "Beginner",
        required: true
    },
    weeklyTimeCommitment: {
        type: Number,
        default: 5,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
},{
    timestamps:true
});

const LearningPath = mongoose.model("LearningPath", learningPathSchema);
export default LearningPath;