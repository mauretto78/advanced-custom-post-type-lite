import {SYNC_POSTS_FAILURE, SYNC_POSTS_IN_PROGRESS, SYNC_POSTS_SUCCESS} from "../actions/syncPostsAction";

const initialState = {
    success: null,
    loading: false,
    errors: []
};

export const syncPostsReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case SYNC_POSTS_IN_PROGRESS:
            console.log('sync posts in progress...');

            return {
                ...state,
                loading: true
            };

        case SYNC_POSTS_FAILURE:
            console.error(payload);

            let errors = [];
            errors.push(payload);

            return {
                ...state,
                success: false,
                loading: false,
                errors: errors
            };

        case SYNC_POSTS_SUCCESS:
            return {
                ...state,
                success: true,
                loading: false,
                errors: []
            };
    }

    return state;
};