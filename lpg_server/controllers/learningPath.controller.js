import LearningPath from "../models/LearningPath.model.js";
import openaiClient from "../config/openaiClient.js";

// Create a new learning path
export const createLearningPath = async (req, res) => {
  // Implementation here
  const {goal, skillLevel, duration, dailyCommitment} = req.body;
  if(!goal || !skillLevel || !duration || !dailyCommitment){
    return res.status(400).json({message: "Please provide all required fields: goal, skillLevel, duration, dailyCommitment"});
  }

  const userId = req.user._id;
  const prompt = `
You are a highly intelligent AI learning path generator.

Your task is to create a **structured, step-by-step learning plan** for the goal: "${goal}".
The learner’s level is: ${level}.
The total timeline is: ${duration}.
The learner can commit approximately **${dailyCommitment} hours per day**.

### Instructions:
1. Break the learning path into **chronological modules**.
2. Each module should have:
   - **Title**: A short, engaging name.
   - **Duration**: Estimated time to complete this module (e.g., "1 week", "3 days", "10 hours").
   - **Description**: A detailed explanation of what the learner will learn.
     - Include **real-life examples or analogies** to simplify difficult concepts.  
       (For example, if explaining neural networks, you could compare them to how the human brain processes information.)
     - Mention **practical applications** — how this knowledge can be used in the real world.
     - Suggest **mini-projects or exercises** to apply what’s learned.
     - End with **2–3 reflective or discussion questions** that help the learner think critically about the topic.

3. Ensure the output is **valid JSON** in this format:

{
  "daily_time_commitment": "${dailyCommitment} hours/day",
  "total_duration": "${duration}",
  "modules": [
    {
      "title": "Module Title",
      "duration": "X days/weeks/hours",
      "description": "Detailed explanation with examples, analogies, applications, exercises, and reflection questions."
    }
  ]
}

Be clear, motivating, and suitable for a ${level} learner.
Avoid jargon unless explained with examples.
Focus on keeping the plan achievable within ${dailyCommitment} hours per day.
`;

  try {
    const response = await openaiClient.chat.completions.create({
      model: process.env.GROQ_API_MODEL_ID,
      messages:[
        { role: "system", content: "You are a helpful AI assistant that generates structured learning plans." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    })

    const learningPathData = response.choices[0].message.content;
    const learningPathJSON = JSON.parse(learningPathData);

    const newLearningPath = new LearningPath({
      userId,
      goal,
      skillLevel,
      duration,
      dailyTimeCommitment: dailyCommitment,
      totalModules: learningPathJSON.modules.length,
      modules: learningPathJSON.modules.map(mod => ({
        title: mod.title,
        content: mod.description,
        duration: mod.duration
      }))
    })

    const savedLearningPath = await newLearningPath.save();

    res.status(201).json({message: "Learning path created successfully", learningPath: savedLearningPath});
  } catch (error) {
    res.status(500).json({message: "Error creating learning path", error: error.message});
  }
};

// Get all learning paths for a user
export const getLearningPaths = async (req, res) => {
  const userId = req.user._id;
  if(!userId){
    return res.status(400).json({message: "User ID not found in request"});
  }
  try {
    const LearningPaths = await LearningPath.find({userId}).select("-modules -dailyTimeCommitment");

    res
      .status(200)
      .json({ message: "Learning paths fetched successfully", learningPaths });
  } catch (error) {
    res.status(500).json({ message: "Error fetching learning paths", error: error.message });
  }
}

// Get a specific learning path by ID
export const getLearningPathById = async (req, res) => {
  const {id} = req.params;
  const userId = req.user._id;

  try {
    
  } catch (error) {
    
  }
}

// Mark a module as completed
export const markModuleAsCompleted = async (req, res) => {
  // Implementation here
}

// Delete a learning path
export const deleteLearningPath = async (req, res) => {
  // Implementation here
}
