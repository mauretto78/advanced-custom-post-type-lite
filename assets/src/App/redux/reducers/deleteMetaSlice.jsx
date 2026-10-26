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
export const deleteMeta = createAsyncThunk(
    "meta/delete",
    async (id, {rejectWithValue}) => {
        try {
            return await wpAjaxRequest("deleteMetaAction", {id:id});
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

export const deleteMetaSlice = createSlice({
    name: 'custom-post-type/delete',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteMeta.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(deleteMeta.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;

                return state;
            })
            .addCase(deleteMeta.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    }
});

// export reducer
export default deleteMetaSlice.reducer;