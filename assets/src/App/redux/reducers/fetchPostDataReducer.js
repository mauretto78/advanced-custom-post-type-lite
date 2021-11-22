import {FETCH_POST_DATA_FAILURE, FETCH_POST_DATA_IN_PROGRESS, FETCH_POST_DATA_SUCCESS} from "../actions/fetchPostDataActions";

const initialState = {
    fetched: {},
    loading: false,
    errors: {}
};

export const fetchPostDataReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case FETCH_POST_DATA_IN_PROGRESS:
            console.log('fetching post data in progress...');

            return {
                ...state,
                loading: true
            };

        case FETCH_POST_DATA_FAILURE:
            console.error(payload);
            return {
                ...state,
                loading: false,
                errors: payload
            };

        case FETCH_POST_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                fetched: payload.data
            };
    }

    return state;
};