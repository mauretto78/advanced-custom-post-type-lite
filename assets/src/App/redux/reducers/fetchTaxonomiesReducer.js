import {FETCH_TAXONOMIES_FAILURE, FETCH_TAXONOMIES_IN_PROGRESS, FETCH_TAXONOMIES_RESET_IN_PROGRESS, FETCH_TAXONOMIES_RESET_SUCCESS, FETCH_TAXONOMIES_SUCCESS} from "../actions/fetchTaxonomiesActions";

const initialState = {
    fetched: [],
    loading: false,
    errors: {}
};

export const fetchTaxonomiesReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case FETCH_TAXONOMIES_RESET_IN_PROGRESS:
            console.log('taxonomies reset in progress...');

            return {
                ...state,
                loading: true
            };

        case FETCH_TAXONOMIES_RESET_SUCCESS:
            return initialState;

        case FETCH_TAXONOMIES_IN_PROGRESS:
            console.log('fetching of taxonomies in progress...');

            return {
                ...state,
                loading: true
            };

        case FETCH_TAXONOMIES_FAILURE:
            console.error(payload);
            return {
                ...state,
                loading: false,
                errors: payload
            };

        case FETCH_TAXONOMIES_SUCCESS:
            return {
                ...state,
                loading: false,
                fetched: payload.data
            };
    }

    return state;
};