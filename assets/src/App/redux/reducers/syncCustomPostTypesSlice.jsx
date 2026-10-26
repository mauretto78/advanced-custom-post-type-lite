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
    async (_, {rejectWithValue}) => {
        try {
            return await wpAjaxRequest("syncPostsAction");
        } catch (error) {
            return rejectWithValue(error.message);
        }
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
    extraReducers: (builder) => {
        builder
            .addCase(syncCustomPostTypes.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(syncCustomPostTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;

                return state;
            })
            .addCase(syncCustomPostTypes.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    }
});

// export reducer
export default syncCustomPostTypesSlice.reducer;