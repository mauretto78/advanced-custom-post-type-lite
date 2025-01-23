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
    license: {},
};

/**
 * ****************************************************
 * Thunks
 * ****************************************************
 */
export const fetchLicense = createAsyncThunk(
    "license/fetch",
    async () => {
        return await wpAjaxRequest("fetchLicenseAction", {});
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const fetchLicenseSlice = createSlice({
    name: 'license/fetch',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [fetchLicense.pending.type]: ( state ) => {
            state.loading = true;
            state.license = {};
            state.error = null;
        },
        [fetchLicense.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.license = action.payload;
            state.error = null;
        },
        [fetchLicense.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.license = {};
            state.error = action.payload;
        },
    }
});

// export reducer
export default fetchLicenseSlice.reducer;