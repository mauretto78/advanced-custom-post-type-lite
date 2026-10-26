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
    async (data, {rejectWithValue}) => {
        try {
            return await wpAjaxRequest("saveWooCommerceProductDataFieldsAction", data);
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

export const saveWooCommerceProductDataFieldsSlice = createSlice({
    name: 'wc/product-data/fields/save',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(saveWooCommerceProductDataFields.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(saveWooCommerceProductDataFields.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;

                return state;
            })
            .addCase(saveWooCommerceProductDataFields.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    }
});

// export reducer
export default saveWooCommerceProductDataFieldsSlice.reducer;