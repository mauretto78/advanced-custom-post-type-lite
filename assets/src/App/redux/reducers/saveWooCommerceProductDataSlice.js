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
export const saveWooCommerceProductData = createAsyncThunk(
    "wc/product-data/save",
    async (data) => {
        return await wpAjaxRequest("saveWooCommerceProductDataAction", data);
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const saveWooCommerceProductDataSlice = createSlice({
    name: 'wc/product-data/save',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [saveWooCommerceProductData.pending.type]: ( state ) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        [saveWooCommerceProductData.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            return state;
        },
        [saveWooCommerceProductData.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    }
});

// export reducer
export default saveWooCommerceProductDataSlice.reducer;