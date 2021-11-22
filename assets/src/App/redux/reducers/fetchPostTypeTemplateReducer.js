import {FETCH_CUSTOM_POST_TYPE_TEMPLATE_FAILURE, FETCH_CUSTOM_POST_TYPE_TEMPLATE_IN_PROGRESS, FETCH_CUSTOM_POST_TYPE_TEMPLATE_SUCCESS} from "../actions/fetchCustomPostTypeTemplateActions";

const initialState = {
    fetched: {},
    loading: false,
    errors: {}
};

export const fetchPostTypeTemplateReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case FETCH_CUSTOM_POST_TYPE_TEMPLATE_IN_PROGRESS:
            console.log('fetching of template in progress...');

            return {
                ...state,
                loading: true
            };

        case FETCH_CUSTOM_POST_TYPE_TEMPLATE_FAILURE:
            console.error(payload);
            return {
                ...state,
                loading: false,
                errors: payload
            };

        case FETCH_CUSTOM_POST_TYPE_TEMPLATE_SUCCESS:
            return {
                ...state,
                loading: false,
                fetched: payload.data
            };
    }

    return state;
};