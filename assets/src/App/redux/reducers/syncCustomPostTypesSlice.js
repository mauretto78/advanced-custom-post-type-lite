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
export const syncCustomPostTypes = createAsyncThunk(
    "custom-post-type/sync",
    async () => {
        return await wpAjaxRequest("syncPostsAction");
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const syncCustomPostTypesSlice = createSlice({
    name: 'custom-post-type/sync',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [syncCustomPostTypes.pending.type]: ( state ) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        [syncCustomPostTypes.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            return state;
        },
        [syncCustomPostTypes.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    }
});

// export reducer
export default syncCustomPostTypesSlice.reducer;