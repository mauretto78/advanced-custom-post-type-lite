export const FETCH_META_IN_PROGRESS = 'FETCH_META_IN_PROGRESS';
export const FETCH_META_SUCCESS = 'FETCH_META_SUCCESS';
export const FETCH_META_FAILURE = 'FETCH_META_FAILURE';

export const fetchMetaInProgress = () => {
    return {
        type: FETCH_META_IN_PROGRESS
    };
};

export const fetchMetaSuccess = (data) => {
    return {
        type: FETCH_META_SUCCESS,
        payload: {data:data},
    };
};

export const fetchMetaFailure = (error) => {
    return {
        type: FETCH_META_FAILURE,
        payload: JSON.parse(error.message),
    };
};
