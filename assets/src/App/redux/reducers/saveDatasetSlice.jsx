import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {wpAjaxRequest} from "../../utils/ajax";

/**
 * ****************************************************
 * Initial state
 * ****************************************************
 */
const initialState = {
    loading: false,
    success: false,
    error: null,
};

/**
 * ****************************************************
 * Thunks
 * ****************************************************
 */
export const saveDataset = createAsyncThunk(
    "form/save",
    async (data) => {
        return await wpAjaxRequest("saveDatasetAction", data);
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const saveDatasetSlice = createSlice({
    name: 'dataset/save',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [saveDataset.pending.type]: ( state ) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        [saveDataset.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            return state;
        },
        [saveDataset.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    }
});

// export reducer
export default saveDatasetSlice.reducer;