export const SYNC_POSTS_IN_PROGRESS = 'SYNC_POSTS_IN_PROGRESS';
export const SYNC_POSTS_SUCCESS = 'SYNC_POSTS_SUCCESS';
export const SYNC_POSTS_FAILURE = 'SYNC_POSTS_FAILURE';

export const syncPostsInProgress = () => {
    return {
        type: SYNC_POSTS_IN_PROGRESS
    };
};

export const syncPostsSuccess = (data) => {
    return {
        type: SYNC_POSTS_SUCCESS,
        payload: {data:data},
    };
};

export const syncPostsFailure = (error) => {
    return {
        type: SYNC_POSTS_FAILURE,
        payload: error,
    };
};