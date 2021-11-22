import {FETCH_META_FAILURE, FETCH_META_IN_PROGRESS, FETCH_META_SUCCESS} from "../actions/fetchMetaActions";

const initialState = {
    fetched: [],
    loading: false,
    errors: {}
};

export const fetchMetaReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case FETCH_META_IN_PROGRESS:
            console.log('fetching of meta in progress...');

            return {
                ...state,
                loading: true
            };

        case FETCH_META_FAILURE:
            console.error(payload);
            return {
                ...state,
                loading: false,
                errors: payload
            };

        case FETCH_META_SUCCESS:
            return {
                ...state,
                loading: false,
                fetched: payload.data
            };
    }

    return state;
};