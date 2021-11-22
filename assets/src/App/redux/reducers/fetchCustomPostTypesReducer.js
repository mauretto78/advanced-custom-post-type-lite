import {
    FETCH_CUSTOM_POST_TYPES_FAILURE,
    FETCH_CUSTOM_POST_TYPES_IN_PROGRESS,
    FETCH_CUSTOM_POST_TYPES_RESET_IN_PROGRESS,
    FETCH_CUSTOM_POST_TYPES_RESET_SUCCESS,
    FETCH_CUSTOM_POST_TYPES_SUCCESS
} from "../actions/fetchCustomPostTypesActions";

const initialState = {
    fetched: [],
    loading: false,
    errors: {}
};

export const fetchPostTypesReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case FETCH_CUSTOM_POST_TYPES_RESET_IN_PROGRESS:
            console.log('post types reset in progress...');

            return {
                ...state,
                loading: true
            };

        case FETCH_CUSTOM_POST_TYPES_RESET_SUCCESS:
            return initialState;

        case FETCH_CUSTOM_POST_TYPES_IN_PROGRESS:
            console.log('fetching of post types in progress...');

            return {
                ...state,
                loading: true
            };

        case FETCH_CUSTOM_POST_TYPES_FAILURE:
            console.error(payload);
            return {
                ...state,
                loading: false,
                errors: payload
            };

        case FETCH_CUSTOM_POST_TYPES_SUCCESS:
            return {
                ...state,
                loading: false,
                fetched: payload.data
            };
    }

    return state;
};