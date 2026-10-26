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
export const assocPostTypeToTaxonomy = createAsyncThunk(
    "custom-post-type/assoc-to-taxonomy",
    async (data, {rejectWithValue}) => {
        try {
            return await wpAjaxRequest("assocPostTypeToTaxonomyAction", data);
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

export const assocPostTypeToTaxonomySlice = createSlice({
    name: 'custom-post-type/assoc-to-taxonomy',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(assocPostTypeToTaxonomy.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(assocPostTypeToTaxonomy.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;

                return state;
            })
            .addCase(assocPostTypeToTaxonomy.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    }
});

// export reducer
export default assocPostTypeToTaxonomySlice.reducer;