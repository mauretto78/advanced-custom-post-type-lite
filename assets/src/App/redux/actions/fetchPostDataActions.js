export const FETCH_POST_DATA_IN_PROGRESS = 'FETCH_POST_DATA_IN_PROGRESS';
export const FETCH_POST_DATA_SUCCESS = 'FETCH_POST_DATA_SUCCESS';
export const FETCH_POST_DATA_FAILURE = 'FETCH_POST_DATA_FAILURE';

export const fetchPostDataInProgress = () => {
    return {
        type: FETCH_POST_DATA_IN_PROGRESS
    };
};

export const fetchPostDataSuccess = (data) => {
    return {
        type: FETCH_POST_DATA_SUCCESS,
        payload: {data:data},
    };
};

export const fetchPostDataFailure = (error) => {
    return {
        type: FETCH_POST_DATA_FAILURE,
        payload: JSON.parse(error.message),
    };
};