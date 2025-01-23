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
export const fetchOptionPages = createAsyncThunk(
    "option-pages/fetch",
    async ({page, perPage}) => {
        return await wpAjaxRequest("fetchOptionPagesAction", {
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

export const fetchOptionPagesSlice = createSlice({
    name: 'option-pages/fetch',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [fetchOptionPages.pending.type]: ( state ) => {
            state.loading = true;
            state.data = [];
            state.error = null;
        },
        [fetchOptionPages.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        },
        [fetchOptionPages.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.data = [];
            state.error = action.payload;
        },
    }
});

// export reducer
export default fetchOptionPagesSlice.reducer;