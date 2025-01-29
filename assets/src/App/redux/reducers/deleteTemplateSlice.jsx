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
export const deleteTemplate = createAsyncThunk(
    "template/delete",
    async (id) => {
        return await wpAjaxRequest("deleteTemplateAction", {id:id});
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const deleteTemplateSlice = createSlice({
    name: 'template/delete',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [deleteTemplate.pending.type]: ( state ) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        [deleteTemplate.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            return state;
        },
        [deleteTemplate.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    }
});

// export reducer
export default deleteTemplateSlice.reducer;