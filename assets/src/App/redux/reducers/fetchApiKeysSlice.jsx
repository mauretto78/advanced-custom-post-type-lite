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
export const fetchApiKeys = createAsyncThunk(
    "api-keys/fetch",
    async (meta) => {
        return await wpAjaxRequest("fetchApiKeysAction", meta ? meta : {});
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const fetchApiKeysSlice = createSlice({
    name: 'api-keys/fetch',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [fetchApiKeys.pending.type]: ( state ) => {
            state.loading = true;
            state.data = [];
            state.error = null;
        },
        [fetchApiKeys.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        },
        [fetchApiKeys.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.data = [];
            state.error = action.payload;
        },
    }
});

// export reducer
export default fetchApiKeysSlice.reducer;
