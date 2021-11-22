import {DELETE_POST_TYPE_TEMPLATE_FAILURE, DELETE_POST_TYPE_TEMPLATE_IN_PROGRESS, DELETE_POST_TYPE_TEMPLATE_SUCCESS} from "../actions/deletePostTypeTemplateActions";

const initialState = {
    success: false,
    loading: false,
    errors: []
};

export const deletePostTypeTemplateReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case DELETE_POST_TYPE_TEMPLATE_IN_PROGRESS:
            console.log('deleting template in progress...');

            return {
                ...state,
                success: false,
                loading: true
            };

        case DELETE_POST_TYPE_TEMPLATE_FAILURE:
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

        case DELETE_POST_TYPE_TEMPLATE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                errors: []
            };
    }

    return state;
};