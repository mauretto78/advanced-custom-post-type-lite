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
export const saveTaxonomy = createAsyncThunk(
    "taxonomy/save",
    async (data, {rejectWithValue}) => {
        try {
            return await wpAjaxRequest("saveTaxonomyAction", data);
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

export const saveTaxonomySlice = createSlice({
    name: 'taxonomy/save',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(saveTaxonomy.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(saveTaxonomy.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;

                return state;
            })
            .addCase(saveTaxonomy.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    }
});

// export reducer
export default saveTaxonomySlice.reducer;