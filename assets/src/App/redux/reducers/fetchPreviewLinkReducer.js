import {FETCH_PREVIEW_LINK_FAILURE, FETCH_PREVIEW_LINK_IN_PROGRESS, FETCH_PREVIEW_LINK_SUCCESS} from "../actions/fetchPreviewLinkActions";

const initialState = {
    fetched: {},
    loading: false,
    errors: {}
};

export const fetchPreviewLinkReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case FETCH_PREVIEW_LINK_IN_PROGRESS:
            console.log('fetching of preview links in progress...');

            return {
                ...state,
                loading: true
            };

        case FETCH_PREVIEW_LINK_FAILURE:
            console.error(payload);
            return {
                ...state,
                loading: false,
                errors: payload
            };

        case FETCH_PREVIEW_LINK_SUCCESS:
            return {
                ...state,
                loading: false,
                fetched: payload.data
            };
    }

    return state;
};