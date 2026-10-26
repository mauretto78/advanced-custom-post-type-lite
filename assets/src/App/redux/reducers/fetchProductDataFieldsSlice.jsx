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
    async (id, {rejectWithValue}) => {
        try {
            return await wpAjaxRequest("fetchWooCommerceProductDataFieldsAction", {
                id: id
            });
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

export const fetchProductDataFieldsSlice = createSlice({
    name: 'wp/product-data/fields/fetch',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductDataFields.pending, (state) => {
                state.loading = true;
                state.data = [];
                state.error = null;
            })
            .addCase(fetchProductDataFields.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchProductDataFields.rejected, (state, action) => {
                state.loading = false;
                state.data = [];
                state.error = action.payload;
            });
    }
});

// export reducer
export default fetchProductDataFieldsSlice.reducer;