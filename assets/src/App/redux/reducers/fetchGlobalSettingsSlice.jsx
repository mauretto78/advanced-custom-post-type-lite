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
    settings: {},
};

/**
 * ****************************************************
 * Thunks
 * ****************************************************
 */
export const fetchGlobalSettings = createAsyncThunk(
    "settings/fetch",
    async () => {
        return await wpAjaxRequest("globalSettingsAction", {});
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const fetchGlobalSettingsSlice = createSlice({
    name: 'settings/fetch',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [fetchGlobalSettings.pending.type]: ( state ) => {
            state.loading = true;
            state.settings = {};
            state.error = null;
        },
        [fetchGlobalSettings.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.settings = action.payload;
            state.error = null;
        },
        [fetchGlobalSettings.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.settings = {};
            state.error = action.error.name;
        },
    }
});

// export reducer
export default fetchGlobalSettingsSlice.reducer;