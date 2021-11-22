import {FETCH_CUSTOM_POST_TYPES_COUNT_FAILURE, FETCH_CUSTOM_POST_TYPES_COUNT_IN_PROGRESS, FETCH_CUSTOM_POST_TYPES_COUNT_SUCCESS} from "../actions/fetchCustomPostTypesCountActions";

const initialState = {
    fetched: 0,
    loading: false,
    errors: {}
};

export const fetchPostTypesCountReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case FETCH_CUSTOM_POST_TYPES_COUNT_IN_PROGRESS:
            console.log('fetching of post types count in progress...');

            return {
                ...state,
                loading: true
            };

        case FETCH_CUSTOM_POST_TYPES_COUNT_FAILURE:
            console.error(payload);
            return {
                ...state,
                loading: false,
                errors: payload
            };

        case FETCH_CUSTOM_POST_TYPES_COUNT_SUCCESS:
            return {
                ...state,
                loading: false,
                fetched: payload.data
            };
    }

    return state;
};