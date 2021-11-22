export const FETCH_SIDEBARS_IN_PROGRESS = 'FETCH_SIDEBARS_IN_PROGRESS';
export const FETCH_SIDEBARS_SUCCESS = 'FETCH_SIDEBARS_SUCCESS';
export const FETCH_SIDEBARS_FAILURE = 'FETCH_SIDEBARS_FAILURE';

export const fetchSidebarsInProgress = () => {
    return {
        type: FETCH_SIDEBARS_IN_PROGRESS,
    };
};

export const fetchSidebarsSuccess = (data) => {
    return {
        type: FETCH_SIDEBARS_SUCCESS,
        payload: {data:data},
    };
};

export const fetchSidebarsFailure = (error) => {
    return {
        type: FETCH_SIDEBARS_FAILURE,
        payload: JSON.parse(error.message),
    };
};
