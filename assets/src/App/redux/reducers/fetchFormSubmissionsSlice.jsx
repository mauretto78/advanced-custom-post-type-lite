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
export const fetchFormSubmissions = createAsyncThunk(
    "forms/fetch-submissions",
    async ({id, page, perPage}) => {
        return await wpAjaxRequest("fetchFormSubmissionsAction", {
            id: id,
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

export const fetchFormSubmissionsSlice = createSlice({
    name: 'forms/fetch',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [fetchFormSubmissions.pending.type]: (state ) => {
            state.loading = true;
            state.data = [];
            state.error = null;
        },
        [fetchFormSubmissions.fulfilled.type]: (state, action ) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        },
        [fetchFormSubmissions.rejected.type]: (state, action ) => {
            state.loading = false;
            state.data = [];
            state.error = action.payload;
        },
    }
});

// export reducer
export default fetchFormSubmissionsSlice.reducer;