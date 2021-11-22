export const DELETE_POST_TYPE_TEMPLATE_IN_PROGRESS = 'DELETE_POST_TYPE_TEMPLATE_IN_PROGRESS';
export const DELETE_POST_TYPE_TEMPLATE_SUCCESS = 'DELETE_POST_TYPE_TEMPLATE_SUCCESS';
export const DELETE_POST_TYPE_TEMPLATE_FAILURE = 'DELETE_POST_TYPE_TEMPLATE_FAILURE';

export const deletePostTypeTemplateInProgress = (postType, templateType) => {
    return {
        type: DELETE_POST_TYPE_TEMPLATE_IN_PROGRESS,
        payload: {
            postType: postType,
            templateType: templateType
        }
    };
};

export const deletePostTypeTemplateSuccess = (data) => {
    return {
        type: DELETE_POST_TYPE_TEMPLATE_SUCCESS,
        payload: {data:data},
    };
};

export const deletePostTypeTemplateFailure = (error) => {
    return {
        type: DELETE_POST_TYPE_TEMPLATE_FAILURE,
        payload: JSON.parse(error.message),
    };
};
