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
    extraReducers: (builder) => {
        builder
            .addCase(fetchGlobalSettings.pending, (state) => {
                state.loading = true;
                state.settings = {};
                state.error = null;
            })
            .addCase(fetchGlobalSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload;
                state.error = null;
            })
            .addCase(fetchGlobalSettings.rejected, (state, action) => {
                state.loading = false;
                state.settings = {};
                state.error = action.error.name;
            });
    }
});

// export reducer
export default fetchGlobalSettingsSlice.reducer;