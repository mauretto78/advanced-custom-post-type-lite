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
    async (data, {rejectWithValue}) => {
        try {
            return await wpAjaxRequest("saveWooCommerceProductDataAction", data);
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

export const saveWooCommerceProductDataSlice = createSlice({
    name: 'wc/product-data/save',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(saveWooCommerceProductData.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(saveWooCommerceProductData.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;

                return state;
            })
            .addCase(saveWooCommerceProductData.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    }
});

// export reducer
export default saveWooCommerceProductDataSlice.reducer;