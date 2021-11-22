import {FETCH_TAXONOMIES_COUNT_FAILURE, FETCH_TAXONOMIES_COUNT_IN_PROGRESS, FETCH_TAXONOMIES_COUNT_SUCCESS} from "../actions/fetchTaxonomiesCountActions";

const initialState = {
    fetched: 0,
    loading: false,
    errors: {}
};

export const fetchTaxonomiesCountReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case FETCH_TAXONOMIES_COUNT_IN_PROGRESS:
            console.log('fetching of post types count in progress...');

            return {
                ...state,
                loading: true
            };

        case FETCH_TAXONOMIES_COUNT_FAILURE:
            console.error(payload);
            return {
                ...state,
                loading: false,
                errors: payload
            };

        case FETCH_TAXONOMIES_COUNT_SUCCESS:
            return {
                ...state,
                loading: false,
                fetched: payload.data
            };
    }

    return state;
};