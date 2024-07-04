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
    data: {},
};

/**
 * ****************************************************
 * Thunks
 * ****************************************************
 */
export const fetchTemplate = createAsyncThunk(
    "template/fetch",
    async (id) => {
        return await wpAjaxRequest("fetchTemplateAction", {id:id});
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const fetchTemplateSlice = createSlice({
    name: 'template/fetch',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [fetchTemplate.pending.type]: ( state ) => {
            state.loading = true;
            state.data = {};
            state.error = null;
        },
        [fetchTemplate.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        },
        [fetchTemplate.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.data = {};
            state.error = action.payload;
        },
    }
});

// export reducer
export default fetchTemplateSlice.reducer;