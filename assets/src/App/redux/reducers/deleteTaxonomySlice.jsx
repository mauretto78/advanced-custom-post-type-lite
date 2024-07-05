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
    async (taxonomy) => {
        return await wpAjaxRequest("deleteTaxonomyAction", {taxonomy:taxonomy});
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
    extraReducers: {
        [deleteTaxonomy.pending.type]: ( state ) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        [deleteTaxonomy.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            return state;
        },
        [deleteTaxonomy.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    }
});

// export reducer
export default deleteTaxonomySlice.reducer;