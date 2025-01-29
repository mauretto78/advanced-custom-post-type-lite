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
export const fetchForms = createAsyncThunk(
    "forms/fetch",
    async ({page, perPage}) => {
        return await wpAjaxRequest("fetchFormsAction", {
            page: page,
            perPage: perPage
        });
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const fetchFormsSlice = createSlice({
    name: 'forms/fetch',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [fetchForms.pending.type]: (state ) => {
            state.loading = true;
            state.data = [];
            state.error = null;
        },
        [fetchForms.fulfilled.type]: (state, action ) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        },
        [fetchForms.rejected.type]: (state, action ) => {
            state.loading = false;
            state.data = [];
            state.error = action.payload;
        },
    }
});

// export reducer
export default fetchFormsSlice.reducer;