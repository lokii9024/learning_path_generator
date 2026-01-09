import { Community } from "../models/Community.model";
import { LearningPath } from "../models/LearningPath.model";
import { Upvote } from "../models/Upvotes.model";
import { Comment } from "../models/Comments.model";

// Add Learning Path to Community Controller
export const addLearningPathToCommunity = async (req, res) => {
  const { pathId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const learningPath = await LearningPath
      .findById(pathId)
      .select("-modules");

    if (!learningPath) {
      return res.status(404).json({
        success: false,
        message: "Learning path not found"
      });
    }

    if (learningPath.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to share this learning path"
      });
    }

    // Prevent duplicate community publish (atomic via unique index)
    const communityPath = await Community.create({
      goal: learningPath.goal,
      modulesCount: learningPath.totalModules,
      creatorId: userId,
      level: learningPath.skillLevel,
      duration: learningPath.duration,
      rootPathId: learningPath._id,
      sourceLearningPathId: learningPath._id, // 🔑 CRITICAL
      parentPathId: null // original publish
    });

    return res.status(201).json({
      success: true,
      message: "Learning path published to community",
      communityPath
    });

  } catch (error) {
    // Handle duplicate publish gracefully
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This learning path is already published to the community"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error publishing learning path",
      error: error.message
    });
  }
};

// get all community learning paths in paginated form

// get details of a community learning path
export const getCommunityLearningPathDetails = async (req, res) => {
  const { communityPathId } = req.params;
  const userId = req.user?._id;
  if(!userId){
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const communityPath = await Community.findById(communityPathId);
    if(!communityPath){
      return res.status(404).json({
        success: false,
        message: "Community learning path not found"
      });
    }

    // find the top-most ancestor rootPathId
    const rootPathId = communityPath.rootPathId || communityPath._id;

    const originalPath = await LearningPath.findOne({
      _id: rootPathId
    });

    return res.status(200).json({
      success: true,
      communityPath,
      originalPath
    });
  }catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching community learning path details",
      error: error.message
    });
  }
}

// upvote a community learning path
export const toggleUpvoteForCommunityPath = async (req, res) => {
  const {communityPathId} = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const communityPath = await Community.findById(communityPathId);
    if (!communityPath) {
      return res.status(404).json({
        success: false,
        message: "Community learning path not found"
      });
    }

    // check if user has already upvoted
    const existingUpvote = await Upvote.findOne({ userId, communityPathId });

    if(existingUpvote){
      // remove upvote
      await Upvote.deleteOne({ userId, communityPathId });
      communityPath.upvotesCount = Math.max(0, communityPath.upvotesCount - 1);
      await communityPath.save();
      return res.status(200).json({
        success: true,
        message: "Upvote removed",
        upvotesCount: communityPath.upvotesCount
      });
    }

    // add upvote
    await Upvote.create({ userId, communityPathId });
    communityPath.upvotesCount += 1;
    await communityPath.save();
    return res.status(200).json({
      success: true,
      message: "Upvoted successfully",
      upvotesCount: communityPath.upvotesCount
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error toggling upvote",
      error: error.message
    });
  }
}

// comment on a community learning path
export const addCommentToCommunityPath = async (req, res) => {
  const {communityPathId} = req.params;
  const userId = req.user?._id;
  const { commentText } = req.body;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const communityPath = await Community.findById(communityPathId);
    if (!communityPath) {
      return res.status(404).json({
        success: false,
        message: "Community learning path not found"
      });
    }

    const comment = await Comment.create({
      userId,
      communityPathId,
      commentText
    });

    communityPath.commentsCount += 1;
    await communityPath.save();

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error adding comment",
      error: error.message
    });
  }
}

// fork a community learning path
export const forkCommunityLearningPath = async (req, res) => {
  const { communityPathId } = req.params;
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const communityPath = await Community.findById(communityPathId);
    if(!communityPath){
      return res.status(404).json({
        success: false,
        message: "Community learning path not found"
      });
    }

    // create a forked learning path
    const forkedLearningPath = await LearningPath.create({
      goal: communityPath.goal,
      level: communityPath.level,
      duration: communityPath.duration,
      creatorId: userId,
      parentPathId: communityPathId,
      sourceLearningPathId: null,// forks do not have sourceLearningPathId
      modulesCount: communityPath.modulesCount,
      rootPathId: communityPath.rootPathId || communityPath._id,
    });

    // increment forks count in community path
    communityPath.forksCount += 1;
    await communityPath.save();

    return res.status(201).json({
      success: true,
      message: "Learning path forked successfully",
      forkedLearningPath
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating fork",
      error: error.message
    })
  }
}