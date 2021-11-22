import {FETCH_POSTS_FAILURE, FETCH_POSTS_IN_PROGRESS, FETCH_POSTS_SUCCESS} from "../actions/fetchPostsActions";

const initialState = {
    fetched: [],
    loading: false,
    errors: {}
};

export const fetchPostsReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case FETCH_POSTS_IN_PROGRESS:
            console.log('fetching of posts in progress...');

            return {
                ...state,
                loading: true
            };

        case FETCH_POSTS_FAILURE:
            console.error(payload);
            return {
                ...state,
                loading: false,
                errors: payload
            };

        case FETCH_POSTS_SUCCESS:
            return {
                ...state,
                loading: false,
                fetched: payload.data
            };
    }

    return state;
};