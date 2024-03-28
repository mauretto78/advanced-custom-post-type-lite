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
export const fetchTaxonomies = createAsyncThunk(
    "taxonomies/fetch",
    async (meta) => {
        return await wpAjaxRequest("fetchTaxonomiesAction", meta ? meta : {});
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const fetchTaxonomiesSlice = createSlice({
    name: 'taxonomies/fetch',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [fetchTaxonomies.pending.type]: ( state ) => {
            state.loading = true;
            state.data = [];
            state.error = null;
        },
        [fetchTaxonomies.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        },
        [fetchTaxonomies.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.data = [];
            state.error = action.payload;
        },
    }
});

// export reducer
export default fetchTaxonomiesSlice.reducer;