export const ASSOC_POST_TO_TAXONOMY_IN_PROGRESS = 'ASSOC_POST_TO_TAXONOMY_IN_PROGRESS';
export const ASSOC_POST_TO_TAXONOMY_SUCCESS = 'ASSOC_POST_TO_TAXONOMY_SUCCESS';
export const ASSOC_POST_TO_TAXONOMY_FAILURE = 'ASSOC_POST_TO_TAXONOMY_FAILURE';

export const assocPostTypeToTaxonomyInProgress = () => {
    return {
        type: ASSOC_POST_TO_TAXONOMY_IN_PROGRESS
    };
};

export const assocPostTypeToTaxonomySuccess = (data) => {
    return {
        type: ASSOC_POST_TO_TAXONOMY_SUCCESS,
        payload: {data:data},
    };
};

export const assocPostTypeToTaxonomyFailure = (error) => {
    return {
        type: ASSOC_POST_TO_TAXONOMY_FAILURE,
        payload: JSON.parse(error.message),
    };
};
