export const SLUGGIFY_IN_PROGRESS = 'SLUGGIFY_IN_PROGRESS';
export const SLUGGIFY_SUCCESS = 'SLUGGIFY_SUCCESS';
export const SLUGGIFY_FAILURE = 'SLUGGIFY_FAILURE';

export const sluggifyInProgress = () => {
    return {
        type: SLUGGIFY_IN_PROGRESS
    };
};

export const sluggifySuccess = (string) => {
    return {
        type: SLUGGIFY_SUCCESS,
        payload: {string},
    };
};

export const sluggifyFailure = (error) => {
    return {
        type: SLUGGIFY_FAILURE,
        payload: error,
    };
};