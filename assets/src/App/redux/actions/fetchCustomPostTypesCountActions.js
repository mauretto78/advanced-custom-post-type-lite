export const FETCH_CUSTOM_POST_TYPES_COUNT_IN_PROGRESS = 'FETCH_CUSTOM_POST_TYPES_COUNT_IN_PROGRESS';
export const FETCH_CUSTOM_POST_TYPES_COUNT_SUCCESS = 'FETCH_CUSTOM_POST_TYPES_COUNT_SUCCESS';
export const FETCH_CUSTOM_POST_TYPES_COUNT_FAILURE = 'FETCH_CUSTOM_POST_TYPES_COUNT_FAILURE';

export const fetchPostTypesCountInProgress = () => {
    return {
        type: FETCH_CUSTOM_POST_TYPES_COUNT_IN_PROGRESS
    };
};

export const fetchPostTypesCountSuccess = (data) => {
    return {
        type: FETCH_CUSTOM_POST_TYPES_COUNT_SUCCESS,
        payload: {data:data},
    };
};

export const fetchPostTypesCountFailure = (error) => {
    return {
        type: FETCH_CUSTOM_POST_TYPES_COUNT_FAILURE,
        payload: JSON.parse(error.message),
    };
};
