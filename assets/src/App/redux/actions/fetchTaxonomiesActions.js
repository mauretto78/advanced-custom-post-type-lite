export const FETCH_TAXONOMIES_IN_PROGRESS = 'FETCH_TAXONOMIES_IN_PROGRESS';
export const FETCH_TAXONOMIES_SUCCESS = 'FETCH_TAXONOMIES_SUCCESS';
export const FETCH_TAXONOMIES_FAILURE = 'FETCH_TAXONOMIES_FAILURE';
export const FETCH_TAXONOMIES_RESET_IN_PROGRESS = 'FETCH_TAXONOMIES_RESET_IN_PROGRESS';
export const FETCH_TAXONOMIES_RESET_SUCCESS = 'FETCH_TAXONOMIES_RESET_SUCCESS';

export const resetTaxonomiesInProgress = () => {
    return {
        type: FETCH_TAXONOMIES_RESET_IN_PROGRESS
    };
};

export const resetTaxonomiesSuccess = () => {
    return {
        type: FETCH_TAXONOMIES_RESET_SUCCESS
    };
};

export const fetchTaxonomiesInProgress = (meta) => {
    return {
        type: FETCH_TAXONOMIES_IN_PROGRESS,
        payload: {
            meta: meta
        }
    };
};

export const fetchTaxonomiesSuccess = (data) => {
    return {
        type: FETCH_TAXONOMIES_SUCCESS,
        payload: {data:data},
    };
};

export const fetchTaxonomiesFailure = (error) => {
    return {
        type: FETCH_TAXONOMIES_FAILURE,
        payload: JSON.parse(error.message),
    };
};
