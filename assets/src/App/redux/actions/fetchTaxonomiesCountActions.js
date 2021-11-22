export const FETCH_TAXONOMIES_COUNT_IN_PROGRESS = 'FETCH_TAXONOMIES_COUNT_IN_PROGRESS';
export const FETCH_TAXONOMIES_COUNT_SUCCESS = 'FETCH_TAXONOMIES_COUNT_SUCCESS';
export const FETCH_TAXONOMIES_COUNT_FAILURE = 'FETCH_TAXONOMIES_COUNT_FAILURE';

export const fetchTaxonomiesCountInProgress = () => {
    return {
        type: FETCH_TAXONOMIES_COUNT_IN_PROGRESS
    };
};

export const fetchTaxonomiesCountSuccess = (data) => {
    return {
        type: FETCH_TAXONOMIES_COUNT_SUCCESS,
        payload: {data:data},
    };
};

export const fetchTaxonomiesCountFailure = (error) => {
    return {
        type: FETCH_TAXONOMIES_COUNT_FAILURE,
        payload: JSON.parse(error.message),
    };
};
