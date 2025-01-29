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
export const importData = createAsyncThunk(
    "data/import",
    async (data) => {
        return await wpAjaxRequest("importFileAction", data);
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const importDataSlice = createSlice({
    name: 'data/import',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [importData.pending.type]: ( state ) => {
            state.loading = true;
            state.data = [];
            state.error = null;
        },
        [importData.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        },
        [importData.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.data = [];
            state.error = action.payload;
        },
    }
});

// export reducer
export default importDataSlice.reducer;
