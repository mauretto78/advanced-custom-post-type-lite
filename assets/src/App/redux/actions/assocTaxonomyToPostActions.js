export const ASSOC_TAXONOMY_TO_POST_IN_PROGRESS = 'ASSOC_TAXONOMY_TO_POST_IN_PROGRESS';
export const ASSOC_TAXONOMY_TO_POST_SUCCESS = 'ASSOC_TAXONOMY_TO_POST_SUCCESS';
export const ASSOC_TAXONOMY_TO_POST_FAILURE = 'ASSOC_TAXONOMY_TO_POST_FAILURE';

export const assocTaxonomyToPostInProgress = () => {
    return {
        type: ASSOC_TAXONOMY_TO_POST_IN_PROGRESS
    };
};

export const assocTaxonomyToPostSuccess = (data) => {
    return {
        type: ASSOC_TAXONOMY_TO_POST_SUCCESS,
        payload: {data:data},
    };
};

export const assocTaxonomyToPostFailure = (error) => {
    return {
        type: ASSOC_TAXONOMY_TO_POST_FAILURE,
        payload: JSON.parse(error.message),
    };
};
