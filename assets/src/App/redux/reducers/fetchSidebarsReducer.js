import {FETCH_SIDEBARS_FAILURE, FETCH_SIDEBARS_IN_PROGRESS, FETCH_SIDEBARS_SUCCESS} from "../actions/fetchSidebarsActions";

const initialState = {
    fetched: [],
    loading: false,
    errors: {}
};

export const fetchSidebarsReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case FETCH_SIDEBARS_IN_PROGRESS:
            console.log('fetching of sidebars in progress...');

            return {
                ...state,
                loading: true
            };

        case FETCH_SIDEBARS_FAILURE:
            console.error(payload);
            return {
                ...state,
                loading: false,
                errors: payload
            };

        case FETCH_SIDEBARS_SUCCESS:
            return {
                ...state,
                loading: false,
                fetched: payload.data
            };
    }

    return state;
};