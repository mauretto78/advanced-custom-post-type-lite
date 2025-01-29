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
export const deletePage = createAsyncThunk(
    "option-pages/delete",
    async (id) => {
        return await wpAjaxRequest("deletePageAction", {id:id});
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const deletePageSlice = createSlice({
    name: 'option-pages/delete',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [deletePage.pending.type]: ( state ) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        [deletePage.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            return state;
        },
        [deletePage.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    }
});

// export reducer
export default deletePageSlice.reducer;