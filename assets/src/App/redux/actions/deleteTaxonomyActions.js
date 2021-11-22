export const DELETE_TAXONOMY_IN_PROGRESS = 'DELETE_TAXONOMY_IN_PROGRESS';
export const DELETE_TAXONOMY_SUCCESS = 'DELETE_TAXONOMY_SUCCESS';
export const DELETE_TAXONOMY_FAILURE = 'DELETE_TAXONOMY_FAILURE';

export const deleteTaxonomyInProgress = (taxonomy) => {
    return {
        type: DELETE_TAXONOMY_IN_PROGRESS,
        payload: {
            taxonomy: taxonomy
        }
    };
};

export const deleteTaxonomySuccess = (data) => {
    return {
        type: DELETE_TAXONOMY_SUCCESS,
        payload: {data:data},
    };
};

export const deleteTaxonomyFailure = (error) => {
    return {
        type: DELETE_TAXONOMY_FAILURE,
        payload: JSON.parse(error.message),
    };
};
