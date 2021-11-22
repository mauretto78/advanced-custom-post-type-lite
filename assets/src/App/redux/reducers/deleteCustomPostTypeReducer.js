import {DELETE_CUSTOM_POST_TYPE_FAILURE, DELETE_CUSTOM_POST_TYPE_IN_PROGRESS, DELETE_CUSTOM_POST_TYPE_SUCCESS} from "../actions/deleteCustomPostTypeActions";

const initialState = {
    success: false,
    loading: false,
    errors: []
};

export const deleteCustomPostTypeReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case DELETE_CUSTOM_POST_TYPE_IN_PROGRESS:
            console.log('deleting custom post type in progress...');

            return {
                ...state,
                success: false,
                loading: true
            };

        case DELETE_CUSTOM_POST_TYPE_FAILURE:
            console.error(payload);

            const prevErrors = (state.errors.length > 0) ? state.errors : [];
            if(!prevErrors.includes(payload.error)){
                prevErrors.push(payload.error);
            }

            return {
                ...state,
                loading: false,
                success: false,
                errors: prevErrors
            };

        case DELETE_CUSTOM_POST_TYPE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                errors: []
            };
    }

    return state;
};