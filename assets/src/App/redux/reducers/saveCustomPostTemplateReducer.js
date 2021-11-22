import {SAVE_CUSTOM_POST_TEMPLATE_FAILURE, SAVE_CUSTOM_POST_TEMPLATE_IN_PROGRESS, SAVE_CUSTOM_POST_TEMPLATE_SUCCESS} from "../actions/saveCustomPostTypeTemplateActions";

const initialState = {
    success: false,
    loading: false,
    errors: []
};

export const saveCustomPostTemplateReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case SAVE_CUSTOM_POST_TEMPLATE_IN_PROGRESS:
            console.log('Saving custom post type template in progress...');

            return {
                ...state,
                success: false,
                loading: true
            };

        case SAVE_CUSTOM_POST_TEMPLATE_FAILURE:
            console.error(payload);

            const prevErrors = (state.errors.length > 0) ? state.errors : [];
            if(!prevErrors.includes(payload)){
                prevErrors.push(payload);
            }

            return {
                ...state,
                loading: false,
                success: false,
                errors: prevErrors
            };

        case SAVE_CUSTOM_POST_TEMPLATE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                errors: []
            };
    }

    return state;
};