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
    fileExists: false,
    xml: null,
    fields: []
};

/**
 * ****************************************************
 * Thunks
 * ****************************************************
 */
export const fetchWPMLSettings = createAsyncThunk(
    "wpml/settings",
    async () => {
        return await wpAjaxRequest("wpmlConfigAction", {});
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const fetchWPMLSettingsSlice = createSlice({
    name: 'dataset/fetch-all',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [fetchWPMLSettings.pending.type]: (state ) => {
            state.loading = true;
            state.fileExists = false;
            state.xml = null;
            state.fields = [];
            state.error = null;
        },
        [fetchWPMLSettings.fulfilled.type]: (state, action ) => {
            state.loading = false;
            state.fileExists = action.payload.file;
            state.xml = action.payload.xml;
            state.fields = action.payload.fields;
            state.error = null;
        },
        [fetchWPMLSettings.rejected.type]: (state, action ) => {
            state.loading = false;
            state.fileExists = false;
            state.xml = null;
            state.fields = [];
            state.error = action.payload;
        },
    }
});

// export reducer
export default fetchWPMLSettingsSlice.reducer;