import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    learningPaths: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LearningPath"
        }
    ]
},{
    timestamps: true
})

const User = mongoose.model("User", userSchema);
export default User;