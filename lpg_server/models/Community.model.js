import mongoose from "mongoose";

const CommunitySchema = new mongoose.Schema({
    goal: {
        type: String,
        required: true
    },
    modulesCount: {
        type: Number,
        required: true
    },
    level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    // forks lineage
    parentPathId: { // this for forks
        type: mongoose.Schema.Types.ObjectId,
        ref: "LearningPath",
        default: null, // null for original publishes - only forks have this set
        index: true
    },
    // original learning path publishing constraint
    sourceLearningPathId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LearningPath",
        default: null, // null for forks - only original publishes have this set
        index: true
    },
    // for content retrieval optimizations
    rootPathId: { // top-most ancestor in the fork tree
        type: mongoose.Schema.Types.ObjectId,
        ref: "LearningPath",
        default: null,// set for each publish/fork
        index: true
    },
    upvotesCount : {
        type: Number,
        default: 0,
        required: true
    },
    commentsCount : {
        type: Number,
        default: 0,
        required: true
    },
    forksCount : {
        type: Number,
        default: 0,
        required: true  
    },
},{
    timestamps:true
})

CommunitySchema.index(
  { sourceLearningPathId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      sourceLearningPathId: { $exists: true }
    }
  }
);


export const Community = mongoose.model("Community", CommunitySchema);