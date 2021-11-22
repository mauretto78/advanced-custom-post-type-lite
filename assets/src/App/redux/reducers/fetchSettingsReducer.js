import {FETCH_SETTINGS_FAILURE, FETCH_SETTINGS_IN_PROGRESS, FETCH_SETTINGS_SUCCESS} from "../actions/fetchSettingsActions";

const initialState = {
    fetched: [],
    loading: false,
    errors: {}
};

export const fetchSettingsReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case FETCH_SETTINGS_IN_PROGRESS:
            console.log('fetching of settings in progress...');

            return {
                ...state,
                loading: true
            };

        case FETCH_SETTINGS_FAILURE:
            console.error(payload);
            return {
                ...state,
                loading: false,
                errors: payload
            };

        case FETCH_SETTINGS_SUCCESS:
            return {
                ...state,
                loading: false,
                fetched: payload.data
            };
    }

    return state;
};