export const FETCH_CUSTOM_POST_TYPE_TEMPLATE_IN_PROGRESS = 'FETCH_CUSTOM_POST_TYPE_TEMPLATE_IN_PROGRESS';
export const FETCH_CUSTOM_POST_TYPE_TEMPLATE_SUCCESS = 'FETCH_CUSTOM_POST_TYPE_TEMPLATE_SUCCESS';
export const FETCH_CUSTOM_POST_TYPE_TEMPLATE_FAILURE = 'FETCH_CUSTOM_POST_TYPE_TEMPLATE_FAILURE';

export const fetchPostTypeTemplateInProgress = () => {
    return {
        type: FETCH_CUSTOM_POST_TYPE_TEMPLATE_IN_PROGRESS
    };
};

export const fetchPostTypeTemplateSuccess = (data) => {
    return {
        type: FETCH_CUSTOM_POST_TYPE_TEMPLATE_SUCCESS,
        payload: {data:data},
    };
};

export const fetchPostTypeTemplateFailure = (error) => {
    return {
        type: FETCH_CUSTOM_POST_TYPE_TEMPLATE_FAILURE,
        payload: JSON.parse(error.message),
    };
};