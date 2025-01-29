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
export const deleteForm = createAsyncThunk(
    "form/delete",
    async (id) => {
        return await wpAjaxRequest("deleteFormAction", {id:id});
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const deleteFormSlice = createSlice({
    name: 'form/delete',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [deleteForm.pending.type]: ( state ) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        [deleteForm.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            return state;
        },
        [deleteForm.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    }
});

// export reducer
export default deleteFormSlice.reducer;