import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {wpAjaxRequest} from "../../utils/ajax";

/**
 * ****************************************************
 * Initial state
 * ****************************************************
 */
const initialState = {
    loading: false,
    success: false,
    error: null,
};

/**
 * ****************************************************
 * Thunks
 * ****************************************************
 */
export const deleteCustomPostType = createAsyncThunk(
    "custom-post-type/delete",
    async (postType, mode) => {
        return await wpAjaxRequest("deleteCustomPostTypeAction", postType ? {postType:postType, mode:mode} : {});
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const deleteCustomPostTypeSlice = createSlice({
    name: 'custom-post-type/delete',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [deleteCustomPostType.pending.type]: ( state ) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        [deleteCustomPostType.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            return state;
        },
        [deleteCustomPostType.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    }
});

// export reducer
export default deleteCustomPostTypeSlice.reducer;