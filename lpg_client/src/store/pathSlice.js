import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allPaths: [],
    selectedPath: null,
    selectedPathModules: [],
    selectedPathId: null,
}

const pathSlice = createSlice({
    name: "path",
    initialState,
    reducers: {
        setAllPaths : (state, action) => {
            state.allPaths = action.payload.paths;
        },
        setSelectedPathId : (state, action) => {
            state.selectedPathId = action.payload.pathId;
        },
        setSelectedPath : (state,action) => {
            state.selectedPath = action.payload.path;
            state.selectedPathModules = action.payload.path?.modules || [];
        },
        updateCompletionStatusInModule : (state, action) => {
            const {moduleId, newStatus} = action.payload;
            state.selectedPathModules = state.selectedPathModules.map(mod => {
                if(mod.id === moduleId){
                    return {
                        ...mod,
                        isCompleted: newStatus
                    }
                }
                return mod;
            });
            state.selectedPath.modules = state.selectedPathModules;
        },
        clearPathState : (state) => {
            state.allPaths = [];
            state.selectedPath = null;
            state.selectedPathId = null;
        },
        deletePath : (state, action) => {
            state.allPaths = state.allPaths.filter(path => path._id !== action.payload.pathId);
        },
        addPath : (state, action) => {
            state.allPaths.push(action.payload.path);
        },
        setVideosInModule : (state, action) => {
            const {moduleId, videos} = action.payload;
            state.selectedPathModules = state.selectedPathModules.map(mod => {
                if(mod.id === moduleId){
                    return {
                        ...mod,
                        videos: videos
                    }
                }
                return mod;
            });
            state.selectedPath.modules = state.selectedPathModules;
        },
        setReposInModule : (state, action) => {
            const {moduleId, repos} = action.payload;
            state.selectedPathModules = state.selectedPathModules.map(mod => {
                if(mod.id === moduleId){
                    return {
                        ...mod,
                        repos: repos
                    }
                }
                return mod;
            }
            );
            state.selectedPath.modules = state.selectedPathModules;
        },
    }
})

export const {
    setAllPaths,
    setSelectedPath,
    setModulesInPath,
    clearPathState,
    deletePath,
    addPath,
    setSelectedPathId,
    setVideosInModule,
    setReposInModule
} = pathSlice.actions;
export default pathSlice.reducer;
