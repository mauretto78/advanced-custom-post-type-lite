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
export const generateApiKey = createAsyncThunk(
    "api-keys/generate",
    async () => {
        return await wpAjaxRequest("generateApiKeyAction", {});
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const generateApiKeySlice = createSlice({
    name: 'api-keys/generate',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [generateApiKey.pending.type]: ( state ) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        [generateApiKey.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            return state;
        },
        [generateApiKey.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    }
});

// export reducer
export default generateApiKeySlice.reducer;








