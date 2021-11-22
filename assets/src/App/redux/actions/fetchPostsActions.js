export const FETCH_POSTS_IN_PROGRESS = 'FETCH_POSTS_IN_PROGRESS';
export const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';
export const FETCH_POSTS_FAILURE = 'FETCH_POSTS_FAILURE';

export const fetchPostsInProgress = () => {
    return {
        type: FETCH_POSTS_IN_PROGRESS
    };
};

export const fetchPostsSuccess = (data) => {
    return {
        type: FETCH_POSTS_SUCCESS,
        payload: {data:data},
    };
};

export const fetchPostsFailure = (error) => {
    return {
        type: FETCH_POSTS_FAILURE,
        payload: JSON.parse(error.message),
    };
};