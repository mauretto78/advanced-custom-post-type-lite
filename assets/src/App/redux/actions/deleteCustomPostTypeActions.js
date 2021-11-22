export const DELETE_CUSTOM_POST_TYPE_IN_PROGRESS = 'DELETE_CUSTOM_POST_TYPE_IN_PROGRESS';
export const DELETE_CUSTOM_POST_TYPE_SUCCESS = 'DELETE_CUSTOM_POST_TYPE_SUCCESS';
export const DELETE_CUSTOM_POST_TYPE_FAILURE = 'DELETE_CUSTOM_POST_TYPE_FAILURE';

export const deletePostTypeInProgress = (postType, mode) => {
    return {
        type: DELETE_CUSTOM_POST_TYPE_IN_PROGRESS,
        payload: {
            postType: postType,
            mode: mode,
        }
    };
};

export const deletePostTypeSuccess = (data) => {
    return {
        type: DELETE_CUSTOM_POST_TYPE_SUCCESS,
        payload: {data:data},
    };
};

export const deletePostTypeFailure = (error) => {
    return {
        type: DELETE_CUSTOM_POST_TYPE_FAILURE,
        payload: JSON.parse(error.message),
    };
};
