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
export const saveWooCommerceProductDataFields = createAsyncThunk(
    "wc/product-data/fields/save",
    async (data) => {
        return await wpAjaxRequest("saveWooCommerceProductDataFieldsAction", data);
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const saveWooCommerceProductDataFieldsSlice = createSlice({
    name: 'wc/product-data/fields/save',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [saveWooCommerceProductDataFields.pending.type]: ( state ) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        [saveWooCommerceProductDataFields.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            return state;
        },
        [saveWooCommerceProductDataFields.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    }
});

// export reducer
export default saveWooCommerceProductDataFieldsSlice.reducer;