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
export const fetchDataset = createAsyncThunk(
    "dataset/fetch",
    async (id) => {
        return await wpAjaxRequest("fetchDatasetsAction", {
            id: id
        });
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const fetchDatasetSlice = createSlice({
    name: 'dataset/fetch',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [fetchDataset.pending.type]: (state ) => {
            state.loading = true;
            state.data = [];
            state.error = null;
        },
        [fetchDataset.fulfilled.type]: (state, action ) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        },
        [fetchDataset.rejected.type]: (state, action ) => {
            state.loading = false;
            state.data = [];
            state.error = action.payload;
        },
    }
});

// export reducer
export default fetchDatasetSlice.reducer;