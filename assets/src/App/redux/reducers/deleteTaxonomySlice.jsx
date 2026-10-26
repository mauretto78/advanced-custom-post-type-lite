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
export const deleteTaxonomy = createAsyncThunk(
    "taxonomy/delete",
    async (taxonomy, {rejectWithValue}) => {
        try {
            return await wpAjaxRequest("deleteTaxonomyAction", {taxonomy:taxonomy});
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

export const deleteTaxonomySlice = createSlice({
    name: 'taxonomy/delete',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteTaxonomy.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(deleteTaxonomy.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;

                return state;
            })
            .addCase(deleteTaxonomy.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    }
});

// export reducer
export default deleteTaxonomySlice.reducer;