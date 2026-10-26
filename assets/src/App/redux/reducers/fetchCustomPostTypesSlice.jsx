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
export const fetchCustomPostTypes = createAsyncThunk(
    "custom-post-types/fetch",
    async (meta, {rejectWithValue}) => {
        try {
            return await wpAjaxRequest("fetchCustomPostTypesAction", meta ? meta : {});
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

export const fetchCustomPostTypesSlice = createSlice({
    name: 'custom-post-types/fetch',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomPostTypes.pending, (state) => {
                state.loading = true;
                state.data = [];
                state.error = null;
            })
            .addCase(fetchCustomPostTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchCustomPostTypes.rejected, (state, action) => {
                state.loading = false;
                state.data = [];
                state.error = action.payload;
            });
    }
});

// export reducer
export default fetchCustomPostTypesSlice.reducer;