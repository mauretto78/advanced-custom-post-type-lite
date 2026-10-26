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
    async (meta, {rejectWithValue}) => {
        try {
            return await wpAjaxRequest("fetchWooCommerceProductDataAction", meta ? meta : {});
        } catch (error) {
            return rejectWithValue(error.message);
        }
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
    extraReducers: (builder) => {
        builder
            .addCase(fetchWooCommerceProductData.pending, (state) => {
                state.loading = true;
                state.data = [];
                state.error = null;
            })
            .addCase(fetchWooCommerceProductData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchWooCommerceProductData.rejected, (state, action) => {
                state.loading = false;
                state.data = [];
                state.error = action.payload;
            });
    }
});

// export reducer
export default fetchWooCommerceProductDataSlice.reducer;