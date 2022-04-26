export const FETCH_USER_META_IN_PROGRESS = 'FETCH_USER_META_IN_PROGRESS';
export const FETCH_USER_META_SUCCESS = 'FETCH_USER_META_SUCCESS';
export const FETCH_USER_META_FAILURE = 'FETCH_USER_META_FAILURE';

export const fetchUserMetaInProgress = () => {
    return {
        type: FETCH_USER_META_IN_PROGRESS
    };
};

export const fetchUserMetaSuccess = (data) => {
    return {
        type: FETCH_USER_META_SUCCESS,
        payload: {data:data},
    };
};

export const fetchUserMetaFailure = (error) => {
    return {
        type: FETCH_USER_META_FAILURE,
        payload: JSON.parse(error.message),
    };
};