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
export const assocTaxonomyToPostType = createAsyncThunk(
    "taxonomy/assoc-to-post",
    async (data) => {
        return await wpAjaxRequest("assocTaxonomyToPostTypeAction", data);
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const assocTaxonomyToPostTypeSlice = createSlice({
    name: 'taxonomy/assoc-to-post',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [assocTaxonomyToPostType.pending.type]: ( state ) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        [assocTaxonomyToPostType.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            return state;
        },
        [assocTaxonomyToPostType.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    }
});

// export reducer
export default assocTaxonomyToPostTypeSlice.reducer;