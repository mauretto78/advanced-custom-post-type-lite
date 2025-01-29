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
    data: [],
};

/**
 * ****************************************************
 * Thunks
 * ****************************************************
 */
export const fetchFormFields = createAsyncThunk(
    "forms/fields/fetch",
    async (id) => {
        return await wpAjaxRequest("fetchFormFieldsAction", {
            id: id
        });
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const fetchFormFieldsSlice = createSlice({
    name: 'forms/fields/fetch',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [fetchFormFields.pending.type]: (state ) => {
            state.loading = true;
            state.data = [];
            state.error = null;
        },
        [fetchFormFields.fulfilled.type]: (state, action ) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        },
        [fetchFormFields.rejected.type]: (state, action ) => {
            state.loading = false;
            state.data = [];
            state.error = action.payload;
        },
    }
});

// export reducer
export default fetchFormFieldsSlice.reducer;