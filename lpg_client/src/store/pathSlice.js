import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allPaths: [],
    selectedPath: null,
    modulesInPath: [],
}

const pathSlice = createSlice({
    name: "path",
    initialState,
    reducers: {
        setAllPaths : (state, action) => {
            state.allPaths = action.payload.paths;
        },
        setSelectedPath : (state, action) => {
            state.selectedPath = action.payload.pathId;
        },
        setModulesInPath : (state, action) => {
            state.modulesInPath = action.payload.modules;
        },
        clearPathState : (state) => {
            state.allPaths = [];
            state.selectedPath = null;
            state.modulesInPath = [];
        },
        deletePath : (state, action) => {
            state.allPaths = state.allPaths.filter(path => path._id !== action.payload.pathId);
        },
        addPath : (state, action) => {
            state.allPaths.push(action.payload.path);
        }
    }
})

export const {
    setAllPaths,
    setSelectedPath,
    setModulesInPath,
    clearPathState,
    deletePath,
} = pathSlice.actions;
export default pathSlice.reducer;
