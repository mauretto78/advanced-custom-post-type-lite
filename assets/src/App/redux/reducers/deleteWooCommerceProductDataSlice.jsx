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
export const deleteWooCommerceProductData = createAsyncThunk(
    "wp/product-data/delete",
    async (id) => {
        return await wpAjaxRequest("deleteWooCommerceProductDataAction", {id:id});
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const deleteWooCommerceProductDataSlice = createSlice({
    name: 'wp/product-data//delete',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [deleteWooCommerceProductData.pending.type]: ( state ) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        [deleteWooCommerceProductData.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            return state;
        },
        [deleteWooCommerceProductData.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    }
});

// export reducer
export default deleteWooCommerceProductDataSlice.reducer;