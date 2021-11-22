export const FETCH_PREVIEW_LINK_IN_PROGRESS = 'FETCH_PREVIEW_LINK_IN_PROGRESS';
export const FETCH_PREVIEW_LINK_SUCCESS = 'FETCH_PREVIEW_LINK_SUCCESS';
export const FETCH_PREVIEW_LINK_FAILURE = 'FETCH_PREVIEW_LINK_FAILURE';

export const fetchPreviewLinkInProgress = () => {
    return {
        type: FETCH_PREVIEW_LINK_IN_PROGRESS
    };
};

export const fetchPreviewLinkSuccess = (data) => {
    return {
        type: FETCH_PREVIEW_LINK_SUCCESS,
        payload: {data:data},
    };
};

export const fetchPreviewLinkFailure = (error) => {
    return {
        type: FETCH_PREVIEW_LINK_FAILURE,
        payload: JSON.parse(error.message),
    };
};
