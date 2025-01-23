import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {wpAjaxRequest} from "../../utils/ajax";

/**
 * ****************************************************
 * Initial state
 * ****************************************************
 */
const initialState = {
    loading: false,
    error: null,
    data: [],
};

/**
 * ****************************************************
 * Thunks
 * ****************************************************
 */
export const exportData = createAsyncThunk(
    "data/export",
    async ({format, data}) => {
        return await wpAjaxRequest("exportFileAction", {format, data});
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const exportDataSlice = createSlice({
    name: 'data/export',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [exportData.pending.type]: ( state ) => {
            state.loading = true;
            state.data = [];
            state.error = null;
        },
        [exportData.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        },
        [exportData.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.data = [];
            state.error = action.payload;
        },
    }
});

// export reducer
export default exportDataSlice.reducer;
