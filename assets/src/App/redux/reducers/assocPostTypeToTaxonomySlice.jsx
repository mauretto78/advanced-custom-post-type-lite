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
    async (data) => {
        return await wpAjaxRequest("assocPostTypeToTaxonomyAction", data);
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
    extraReducers: {
        [assocPostTypeToTaxonomy.pending.type]: ( state ) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        [assocPostTypeToTaxonomy.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            return state;
        },
        [assocPostTypeToTaxonomy.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    }
});

// export reducer
export default assocPostTypeToTaxonomySlice.reducer;