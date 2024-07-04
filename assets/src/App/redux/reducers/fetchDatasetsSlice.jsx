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
export const fetchDatasets = createAsyncThunk(
    "dataset/fetch-all",
    async ({page, perPage}) => {
        return await wpAjaxRequest("fetchDatasetsAction", {
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

export const fetchDatasetsSlice = createSlice({
    name: 'dataset/fetch-all',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [fetchDatasets.pending.type]: (state ) => {
            state.loading = true;
            state.data = [];
            state.error = null;
        },
        [fetchDatasets.fulfilled.type]: (state, action ) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        },
        [fetchDatasets.rejected.type]: (state, action ) => {
            state.loading = false;
            state.data = [];
            state.error = action.payload;
        },
    }
});

// export reducer
export default fetchDatasetsSlice.reducer;