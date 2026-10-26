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
    async (data, {rejectWithValue}) => {
        try {
            return await wpAjaxRequest("saveCustomPostTypeAction", data);
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

export const saveCustomPostTypeSlice = createSlice({
    name: 'custom-post-type/save',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(saveCustomPostType.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(saveCustomPostType.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;

                return state;
            })
            .addCase(saveCustomPostType.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    }
});

// export reducer
export default saveCustomPostTypeSlice.reducer;