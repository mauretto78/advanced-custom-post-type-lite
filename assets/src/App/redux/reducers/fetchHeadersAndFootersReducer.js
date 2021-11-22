import {FETCH_HEADERS_AND_FOOTERS_FAILURE, FETCH_HEADERS_AND_FOOTERS_IN_PROGRESS, FETCH_HEADERS_AND_FOOTERS_SUCCESS} from "../actions/fetchHeadersAndFootersActions";

const initialState = {
    fetched: [],
    loading: false,
    errors: {}
};

export const fetchHeadersAndFootersReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case FETCH_HEADERS_AND_FOOTERS_IN_PROGRESS:
            console.log('fetching of haeders and footers in progress...');

            return {
                ...state,
                loading: true
            };

        case FETCH_HEADERS_AND_FOOTERS_FAILURE:
            console.error(payload);
            return {
                ...state,
                loading: false,
                errors: payload
            };

        case FETCH_HEADERS_AND_FOOTERS_SUCCESS:
            return {
                ...state,
                loading: false,
                fetched: payload.data
            };
    }

    return state;
};