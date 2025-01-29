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
export const saveFormFields = createAsyncThunk(
    "form/fields/save",
    async ({id, data}) => {
        return await wpAjaxRequest("saveFormFieldsAction", {id: id, data: data});
    }
);

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const saveFormFieldsSlice = createSlice({
    name: 'form/fields/save',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [saveFormFields.pending.type]: ( state ) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        [saveFormFields.fulfilled.type]: ( state, action ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            return state;
        },
        [saveFormFields.rejected.type]: ( state, action ) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
    }
});

// export reducer
export default saveFormFieldsSlice.reducer;