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
export const saveTemplate = createAsyncThunk(
    "template/save",
    async (data) => {
        return await wpAjaxRequest("saveTemplateAction", data);
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const saveTemplateSlice = createSlice({
    name: 'template/save',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [saveTemplate.pending.type]: ( state ) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        [saveTemplate.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            return state;
        },
        [saveTemplate.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    }
});

// export reducer
export default saveTemplateSlice.reducer;