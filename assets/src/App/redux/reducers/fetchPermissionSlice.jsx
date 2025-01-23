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
export const fetchPermission = createAsyncThunk(
    "permission/fetch",
    async (id) => {
        return await wpAjaxRequest("fetchPermissionAction", {id:id});
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const fetchPermissionSlice = createSlice({
    name: 'template/fetch',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [fetchPermission.pending.type]: ( state ) => {
            state.loading = true;
            state.data = {};
            state.error = null;
        },
        [fetchPermission.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        },
        [fetchPermission.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.data = {};
            state.error = action.payload;
        },
    }
});

// export reducer
export default fetchPermissionSlice.reducer;