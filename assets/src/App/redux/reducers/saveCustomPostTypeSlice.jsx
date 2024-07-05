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
export const saveCustomPostType = createAsyncThunk(
    "custom-post-type/save",
    async (data) => {
        return await wpAjaxRequest("saveCustomPostTypeAction", data);
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const saveCustomPostTypeSlice = createSlice({
    name: 'custom-post-type/save',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [saveCustomPostType.pending.type]: ( state ) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        [saveCustomPostType.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            return state;
        },
        [saveCustomPostType.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    }
});

// export reducer
export default saveCustomPostTypeSlice.reducer;