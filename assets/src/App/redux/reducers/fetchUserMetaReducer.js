import {FETCH_USER_META_FAILURE, FETCH_USER_META_IN_PROGRESS, FETCH_USER_META_SUCCESS} from "../actions/fetchUserMetaActions";

const initialState = {
    fetched: [],
    loading: false,
    errors: {}
};

export const fetchUserMetaReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case FETCH_USER_META_IN_PROGRESS:
            console.log('fetching of user meta in progress...');

            return {
                ...state,
                loading: true
            };

        case FETCH_USER_META_FAILURE:
            console.error(payload);
            return {
                ...state,
                loading: false,
                errors: payload
            };

        case FETCH_USER_META_SUCCESS:
            return {
                ...state,
                loading: false,
                fetched: payload.data
            };
    }

    return state;
};