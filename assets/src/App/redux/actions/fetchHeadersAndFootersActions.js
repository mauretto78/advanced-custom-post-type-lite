export const FETCH_HEADERS_AND_FOOTERS_IN_PROGRESS = 'FETCH_HEADERS_AND_FOOTERS_IN_PROGRESS';
export const FETCH_HEADERS_AND_FOOTERS_SUCCESS = 'FETCH_HEADERS_AND_FOOTERS_SUCCESS';
export const FETCH_HEADERS_AND_FOOTERS_FAILURE = 'FETCH_HEADERS_AND_FOOTERS_FAILURE';

export const fetchHeadersAndFootersInProgress = () => {
    return {
        type: FETCH_HEADERS_AND_FOOTERS_IN_PROGRESS,
    };
};

export const fetchHeadersAndFootersSuccess = (data) => {
    return {
        type: FETCH_HEADERS_AND_FOOTERS_SUCCESS,
        payload: {data:data},
    };
};

export const fetchHeadersAndFootersFailure = (error) => {
    return {
        type: FETCH_HEADERS_AND_FOOTERS_FAILURE,
        payload: JSON.parse(error.message),
    };
};
