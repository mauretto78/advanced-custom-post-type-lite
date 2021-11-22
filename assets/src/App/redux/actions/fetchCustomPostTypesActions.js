export const FETCH_CUSTOM_POST_TYPES_IN_PROGRESS = 'FETCH_CUSTOM_POST_TYPES_IN_PROGRESS';
export const FETCH_CUSTOM_POST_TYPES_SUCCESS = 'FETCH_CUSTOM_POST_TYPES_SUCCESS';
export const FETCH_CUSTOM_POST_TYPES_FAILURE = 'FETCH_CUSTOM_POST_TYPES_FAILURE';
export const FETCH_CUSTOM_POST_TYPES_RESET_IN_PROGRESS = 'FETCH_CUSTOM_POST_TYPES_RESET_IN_PROGRESS';
export const FETCH_CUSTOM_POST_TYPES_RESET_SUCCESS = 'FETCH_CUSTOM_POST_TYPES_RESET_SUCCESS';

export const resetPostTypesInProgress = () => {
    return {
        type: FETCH_CUSTOM_POST_TYPES_RESET_IN_PROGRESS
    };
};

export const resetPostTypesSuccess = () => {
    return {
        type: FETCH_CUSTOM_POST_TYPES_RESET_SUCCESS
    };
};

export const fetchPostTypesInProgress = (meta) => {
    return {
        type: FETCH_CUSTOM_POST_TYPES_IN_PROGRESS,
        payload: {
            meta: meta
        }
    };
};

export const fetchPostTypesSuccess = (data) => {
    return {
        type: FETCH_CUSTOM_POST_TYPES_SUCCESS,
        payload: {data:data},
    };
};

export const fetchPostTypesFailure = (error) => {
    return {
        type: FETCH_CUSTOM_POST_TYPES_FAILURE,
        payload: JSON.parse(error.message),
    };
};
