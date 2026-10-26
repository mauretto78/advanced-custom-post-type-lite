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
    async (meta, {rejectWithValue}) => {
        try {
            return await wpAjaxRequest("fetchTaxonomiesAction", meta ? meta : {});
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

export const fetchTaxonomiesSlice = createSlice({
    name: 'taxonomies/fetch',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTaxonomies.pending, (state) => {
                state.loading = true;
                state.data = [];
                state.error = null;
            })
            .addCase(fetchTaxonomies.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchTaxonomies.rejected, (state, action) => {
                state.loading = false;
                state.data = [];
                state.error = action.payload;
            });
    }
});

// export reducer
export default fetchTaxonomiesSlice.reducer;