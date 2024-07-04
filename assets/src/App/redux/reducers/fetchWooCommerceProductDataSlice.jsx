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
export const fetchWooCommerceProductData = createAsyncThunk(
    "wc/product-data/fetch",
    async (meta) => {
        return await wpAjaxRequest("fetchWooCommerceProductDataAction", meta ? meta : {});
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const fetchWooCommerceProductDataSlice = createSlice({
    name: 'wc/product-data/fetch',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [fetchWooCommerceProductData.pending.type]: ( state ) => {
            state.loading = true;
            state.data = [];
            state.error = null;
        },
        [fetchWooCommerceProductData.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        },
        [fetchWooCommerceProductData.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.data = [];
            state.error = action.payload;
        },
    }
});

// export reducer
export default fetchWooCommerceProductDataSlice.reducer;