export const SAVE_CUSTOM_POST_TEMPLATE_IN_PROGRESS = 'SAVE_CUSTOM_POST_TEMPLATE_IN_PROGRESS';
export const SAVE_CUSTOM_POST_TEMPLATE_SUCCESS = 'SAVE_CUSTOM_POST_TEMPLATE_SUCCESS';
export const SAVE_CUSTOM_POST_TEMPLATE_FAILURE = 'SAVE_CUSTOM_POST_TEMPLATE_FAILURE';

export const saveCustomPostTemplateInProgress = () => {
    return {
        type: SAVE_CUSTOM_POST_TEMPLATE_IN_PROGRESS
    };
};

export const saveCustomPostTemplateSuccess = (data) => {
    return {
        type: SAVE_CUSTOM_POST_TEMPLATE_SUCCESS,
        payload: {data:data},
    };
};

export const saveCustomPostTemplateFailure = (error) => {
    return {
        type: SAVE_CUSTOM_POST_TEMPLATE_FAILURE,
        payload: error,
    };
};