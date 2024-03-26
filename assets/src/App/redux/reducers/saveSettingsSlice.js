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
export const saveSettings = createAsyncThunk(
    "settings/save",
    async (data) => {
        return await wpAjaxRequest("saveSettingsAction", data);
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const saveSettingsSlice = createSlice({
    name: 'settings/save',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [saveSettings.pending.type]: ( state ) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        [saveSettings.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            return state;
        },
        [saveSettings.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    }
});

// export reducer
export default saveSettingsSlice.reducer;