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
export const fetchProductDataFields = createAsyncThunk(
    "wp/product-data/fields/fetch",
    async (id) => {
        return await wpAjaxRequest("fetchWooCommerceProductDataFieldsAction", {
            id: id
        });
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const fetchProductDataFieldsSlice = createSlice({
    name: 'wp/product-data/fields/fetch',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [fetchProductDataFields.pending.type]: ( state ) => {
            state.loading = true;
            state.data = [];
            state.error = null;
        },
        [fetchProductDataFields.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        },
        [fetchProductDataFields.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.data = [];
            state.error = action.payload;
        },
    }
});

// export reducer
export default fetchProductDataFieldsSlice.reducer;