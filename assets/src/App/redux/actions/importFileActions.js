export const IMPORT_FILE_IN_PROGRESS = 'IMPORT_FILE_IN_PROGRESS';
export const IMPORT_FILE_SUCCESS = 'IMPORT_FILE_SUCCESS';
export const IMPORT_FILE_FAILURE = 'IMPORT_FILE_FAILURE';

export const importFileInProgress = () => {
    return {
        type: IMPORT_FILE_IN_PROGRESS
    };
};

export const importFileSuccess = (data) => {
    return {
        type: IMPORT_FILE_SUCCESS,
        payload: {data:data},
    };
};

export const importFileFailure = (error) => {
    return {
        type: IMPORT_FILE_FAILURE,
        payload: error,
    };
};