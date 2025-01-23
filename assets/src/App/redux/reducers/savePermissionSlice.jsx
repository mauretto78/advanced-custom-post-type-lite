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
export const savePermission = createAsyncThunk(
    "form/save",
    async (data) => {
        return await wpAjaxRequest("savePermissionAction", data);
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const savePermissionSlice = createSlice({
    name: 'dataset/save',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [savePermission.pending.type]: ( state ) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        [savePermission.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            return state;
        },
        [savePermission.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    }
});

// export reducer
export default savePermissionSlice.reducer;