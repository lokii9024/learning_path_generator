import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/paths`;

export const generateLearningPath = async ({goal, skillLevel, duration, dailyCommitment}) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/generate`,
            {goal, skillLevel, duration, dailyCommitment},
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const learningPath = res?.data?.learningPath || null;
        const message = res?.data?.message || '';
        return {learningPath, message};
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to generate learning path';
        throw {message, status: error.response?.status || 500};
    }
}

export const getUserLearningPaths = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/`, 
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        const learningPaths = res?.data?.LearningPaths || [];
        const message = res?.data?.message || '';
        return {learningPaths, message};
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch learning paths';
        throw {message, status: error.response?.status || 500};
    }
}

export const getLearningPathById = async (pathId) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/${pathId}`,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        const learningPath = res?.data?.learningPath || null;
        const message = res?.data?.message || '';
        return {learningPath,message};
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch learning path';
        throw {message, status: error.response?.status || 500};
    }
}

export const deleteLearningPathById = async (pathId) => {
    try {
        const res = await axios.delete(`${API_BASE_URL}/${pathId}`,
            {},
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
        
        const message = res?.data?.message || 'Learning path deleted successfully';
        const deleted = res?.data?.learningPath || null;
        if(deleted) return true;
        return false;
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to delete learning path';
        throw {message, status: error.response?.status || 500};
    }
}

export const fetchYtVideosForModule = async (pathId, moduleId, moduleTitle) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/${pathId}/module/videos/${moduleId}/${moduleTitle}`,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        const videos = res?.data?.videos || [];
        const message = res?.data?.message || '';
        return { videos, message };
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch videos';
        throw {message, status: error.response?.status || 500};
    }
}

export const fetchRepositoriesForModule = async (pathId, moduleId, moduleTitle) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/${pathId}/module/repos/${moduleId}/${moduleTitle}`,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        const repositories = res?.data?.repos || [];
        const message = res?.data?.message || '';

        return {repositories, message};
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch repositories';
        throw {message, status: error.response?.status || 500};
    }
}

export const markOrUnmarkModuleAsCompleted = async (pathId, moduleId) => {
    try {
        const res = await axios.patch(`${API_BASE_URL}/${pathId}/modules/${moduleId}/complete`,
            {},
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        const success = res?.data?.success || false;
        const progress = res?.data?.progress || null;
        const message = res?.data?.message || '';
        const newStatus = res?.data?.module?.isCompleted;
        return {progress, message, newStatus};
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to update module status';
        throw {message, status: error.response?.status || 500};
    }
}