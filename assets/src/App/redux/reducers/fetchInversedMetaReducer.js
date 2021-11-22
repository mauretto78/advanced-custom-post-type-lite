import {FETCH_INVERSED_META_FAILURE, FETCH_INVERSED_META_IN_PROGRESS, FETCH_INVERSED_META_SUCCESS} from "../actions/fetchInversedMetaActions";

const initialState = {
    fetched: [],
    loading: false,
    errors: {}
};

export const fetchInversedMetaReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case FETCH_INVERSED_META_IN_PROGRESS:
            console.log('fetching of inversed meta in progress...');

            return {
                ...state,
                loading: true
            };

        case FETCH_INVERSED_META_FAILURE:
            console.error(payload);
            return {
                ...state,
                loading: false,
                errors: payload
            };

        case FETCH_INVERSED_META_SUCCESS:
            return {
                ...state,
                loading: false,
                fetched: payload.data
            };
    }

    return state;
};