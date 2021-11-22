export const EXPORT_FILE_IN_PROGRESS = 'EXPORT_FILE_IN_PROGRESS';
export const EXPORT_FILE_SUCCESS = 'EXPORT_FILE_SUCCESS';
export const EXPORT_FILE_FAILURE = 'EXPORT_FILE_FAILURE';

export const exportFileInProgress = () => {
    return {
        type: EXPORT_FILE_IN_PROGRESS
    };
};

export const exportFileSuccess = (data) => {
    return {
        type: EXPORT_FILE_SUCCESS,
        payload: {data:data},
    };
};

export const exportFileFailure = (error) => {
    return {
        type: EXPORT_FILE_FAILURE,
        payload: error,
    };
};