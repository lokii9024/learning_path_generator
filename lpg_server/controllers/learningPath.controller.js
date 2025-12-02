import {LearningPath }from "../models/LearningPath.model.js";
import openaiClient from "../config/openaiClient.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Create a new learning path
export const createLearningPath = async (req, res) => {
  // Implementation here
  const {goal, skillLevel, duration, dailyCommitment} = req.body;
  if(!goal || !skillLevel || !duration || !dailyCommitment){
    return res.status(400).json({message: "Please provide all required fields: goal, skillLevel, duration, dailyCommitment"});
  }

  const userId = req.user._id;
  if(!userId){
    return res.status(400).json({message: "User ID not found in request"});
  }
  const prompt = `
You are a highly intelligent AI learning path generator.

Your task is to create a **structured, step-by-step learning plan** for the goal: "${goal}".
The learner’s level is: ${skillLevel}.
The total timeline is: ${duration}.
The learner can commit approximately **${dailyCommitment} hours per day**.

### IMPORTANT — Resource-Friendly Module Titles:
To help the system fetch high-quality YouTube videos and GitHub repositories automatically, 
**module titles must be keyword-rich and search-friendly**.

Each module title should:
- Contain specific **technical keywords** related to its topic  
  (e.g., “React Hooks”, “Node.js REST APIs”, “Python Data Analysis”, “MongoDB CRUD Operations”).
- Avoid vague titles like “Introduction”, “Basics”, or “Getting Started” — instead use  
  **“Introduction to React Components”**, **"JavaScript Async/Await Basics”**, etc.
- Use terminology commonly found in YouTube tutorials or GitHub project names.

### Instructions for the Learning Path:
1. Break the learning path into **chronological modules**.
2. Each module must include:
   - **Title**: A strong, descriptive title optimized for discovering relevant YouTube tutorials and GitHub repositories.
   - **Duration**: Estimated time to complete (e.g., "1 week", "3 days", "10 hours").
   - **Description**: A detailed explanation of what the learner will learn.
     - Include **real-life examples or analogies** to simplify difficult concepts.
     - Explain **practical real-world applications** of the skills.
     - Suggest **mini-projects or hands-on exercises**.
     - End with **2–3 reflective or discussion questions**.

3. Ensure the output is **valid JSON** in this format:

{
  "daily_time_commitment": "${dailyCommitment} hours/day",
  "total_duration": "${duration}",
  "modules": [
    {
      "title": "Search-Optimized Module Title",
      "duration": "X days/weeks/hours",
      "description": "Detailed explanation with examples, analogies, applications, exercises, and reflection questions."
    }
  ]
}

### Additional Guidance:
- Be clear, motivating, and suitable for a ${skillLevel} learner.
- Avoid jargon unless explained simply.
- Ensure the plan is achievable within ${dailyCommitment} hours per day.
- Module titles should be optimized to match common terms found in YouTube tutorials and GitHub repos.
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
      .json({ message: "Learning paths fetched successfully", LearningPaths });
  } catch (error) {
    res.status(500).json({ message: "Error fetching learning paths", error: error.message });
  }
}

// Get a specific learning path by ID
export const getLearningPathById = async (req, res) => {
  const {id} = req.params;
  const userId = req.user._id;
  if(!id){
    return res.status(400).json({message: "Learning path ID is required"});
  }
  if(!userId){
    return res.status(400).json({message: "User ID not found in request"});
  }
  try {
    const lpg = await LearningPath.findById(id);
    if(!lpg){
      return res.status(404).json({message: "Learning path not found"});
    }

    res.status(200).json({message: "Learning path fetched successfully", learningPath: lpg}); 
  } catch (error) {
    res.status(500).json({message: "Error fetching learning path", error: error.message});
  }
}

//get modules of a learning path
export const getModulesOfLearningPath = async (req, res) => {
  const {pathId} = req.params;
  const userId = req.user._id;

  if(!userId){
    return res.status(400).json({message: "User ID not found in request"});
  }

  try {
    const learningPath = await LearningPath.findById(pathId);
    if(!learningPath){
      return res.status(404).json({message: "Learning path not found"});
    }

    const modules = learningPath.modules;
    res.status(200).json({message: "Modules fetched successfully", modules}); 
  } catch (error) {
    return res.status(500).json({message: "Error fetching modules", error: error.message});
  }
}

// Mark a module as completed
export const markORunmarkModule = async (req, res) => {
  const {pathId, moduleId} = req.params;
  const userId = req.user._id;

  if(!userId){
    return res.status(400).json({message: "User ID not found in request"});
  }

  if(!pathId || !moduleId){
    return res.status(400).json({message: "Learning path ID and Module ID are required"});
  }

  try {
    const learningPath = await LearningPath.findById(pathId);
    if(!learningPath){
      return res.status(404).json({message: "Learning path not found"});
    }

    const module = learningPath.modules.id(moduleId);
    if(!module){
      return res.status(404).json({message: "Module not found"});
    }

    const newStatus = !module.isCompleted;
    module.isCompleted = newStatus;
    learningPath.completedModules = learningPath.modules.filter(mod => mod.isCompleted).length;

    const savedLpg = await learningPath.save();

    if(!savedLpg){
      return res.status(500).json({message: "Failed to update module status"});
    }

    const progress = Math.round((savedLpg.completedModules / savedLpg.modules.length) * 100);

    const savedStatus = savedLpg.modules.id(moduleId).isCompleted;  

    res.status(200).json({
      success: true,
      message: newStatus ? "Module marked as completed" : "Module marked as incomplete",
      module: {
        _id: moduleId,
        isCompleted: savedStatus
      },
      progress
    });
  } catch (error) {
    res.status(500).json({message: "Error updating module status", error: error.message});
  }
  
}

// Delete a learning path
export const deleteLearningPath = async (req, res) => {
  const {id} = req.params;
  const userId = req.user._id;

  try {
    const doesLpgExist = await LearningPath.findById(id);
    if(!doesLpgExist){
      return res.status(404).json({message: "Learning path not found"});
    }
    const deletedLpg = await LearningPath.findOneAndDelete({_id: id, userId});

    res.status(200).json({message: "Learning path deleted successfully", learningPath: deletedLpg});
  } catch (error) {
    res.status(500).json({message: "Error deleting learning path", error: error.message});
  }
}

// Fetch YouTube videos for a module
export const fetchYtVideosForModule = async (req, res) => {
  const {pathId,moduleId,moduleTitle} = req.params;
  if(!moduleTitle){
    return res.status(400).json({message: "Module title is required"});
  }
  try {
    const learningPath = await LearningPath.findById(pathId);
    if(!learningPath) res.status(404).json({message: "Learning path not found"});

    const module = learningPath.modules.id(moduleId);
    if(!module) res.status(404).json({message: "Module not found"});

    if(module.videos && module.videos.length > 0){
      return res.status(200).json({message: "Videos already fetched", videos: module.videos});
    }

    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: moduleTitle,
        type: "video",
        maxResults: 3,
        key: process.env.YT_API_KEY,
        safeSearch: "strict",
      }
    });

    if(!response.data || !response.data.items){
      return res.status(500).json({message: "Invalid response from YouTube API"});
    }
    const items = response?.data?.items?.slice(0,3);
    const videos = items.map((vdo) => ({
      title: vdo.snippet.title,
      channel: vdo.snippet.channelTitle,
      thumbnail: vdo.snippet.thumbnails?.medium?.url,
      url: `https://www.youtube.com/watch?v=${vdo.id.videoId}`,
      publishedAt: vdo.snippet.publishedAt,
    }))

    //insert this array into the module's videos field
    module.videos = videos;
    await learningPath.save();

    res.status(200).json({message: "Videos fetched successfully", videos});
  } catch (error) {
    res.status(500).json({message: "Error fetching videos from YouTube", error: error.message});
  }
}

// Fetch repositories for a module (to be implemented)
export const fetchRepositoriesForModule = async (req, res) => {
  console.log("Fetching repositories for module...");
  const {pathId,moduleId,moduleTitle} = req.params;

  const q = `${moduleTitle} projects in:name,description,readme`;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  try {
    const learningPath = await LearningPath.findById(pathId);
    if(!learningPath) res.status(404).json({message: "Learning path not found"});

    const module = learningPath.modules.id(moduleId);
    if(!module) res.status(404).json({message: "Module not found"});

    if(module.repos && module.repos.length > 0){
      return res.status(200).json({message: "Repositories already fetched", repos: module.repos});
    }

    console.log("Making request to GitHub API...");
    const response = await axios.get("https://api.github.com/search/repositories", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: GITHUB_TOKEN ? `Bearer ${GITHUB_TOKEN}` : undefined,
      },
      params: {
        q,
        sort: "stars",
        order: "desc",
        per_page: 3,
      }
    })

    console.log("GitHub API response received.");
    console.log(response.data);
    if (!response.data || !Array.isArray(response.data.items)) return [];
    const items = response?.data?.items?.slice(0,3);
    const repos = items.map(repo => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      language: repo.language,
      owner: repo.owner.login,
    }))

    //insert this array into the module's repos field
    module.repos = repos;
    await learningPath.save();

    res.status(200).json({message: "Repositories fetched successfully", repos});
  } catch (error) {
    return res.status(500).json({message: "Error fetching repositories from GitHub", error: error.message});
  }
}