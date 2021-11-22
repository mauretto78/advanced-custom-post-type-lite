export const FETCH_INVERSED_META_IN_PROGRESS = 'FETCH_INVERSED_META_IN_PROGRESS';
export const FETCH_INVERSED_META_SUCCESS = 'FETCH_INVERSED_META_SUCCESS';
export const FETCH_INVERSED_META_FAILURE = 'FETCH_INVERSED_META_FAILURE';

export const fetchInversedMetaInProgress = () => {
    return {
        type: FETCH_INVERSED_META_IN_PROGRESS
    };
};

export const fetchInversedMetaSuccess = (data) => {
    return {
        type: FETCH_INVERSED_META_SUCCESS,
        payload: {data:data},
    };
};

export const fetchInversedMetaFailure = (error) => {
    return {
        type: FETCH_INVERSED_META_FAILURE,
        payload: JSON.parse(error.message),
    };
};
