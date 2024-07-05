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
export const fetchCustomPostTypes = createAsyncThunk(
    "custom-post-types/fetch",
    async (meta) => {
        return await wpAjaxRequest("fetchCustomPostTypesAction", meta ? meta : {});
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const fetchCustomPostTypesSlice = createSlice({
    name: 'custom-post-types/fetch',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [fetchCustomPostTypes.pending.type]: ( state ) => {
            state.loading = true;
            state.data = [];
            state.error = null;
        },
        [fetchCustomPostTypes.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        },
        [fetchCustomPostTypes.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.data = [];
            state.error = action.payload;
        },
    }
});

// export reducer
export default fetchCustomPostTypesSlice.reducer;