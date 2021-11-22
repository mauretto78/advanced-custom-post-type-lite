export const SAVE_SETTINGS_IN_PROGRESS = 'SAVE_SETTINGS_IN_PROGRESS';
export const SAVE_SETTINGS_SUCCESS = 'SAVE_SETTINGS_SUCCESS';
export const SAVE_SETTINGS_FAILURE = 'SAVE_SETTINGS_FAILURE';

export const saveSettingsInProgress = () => {
    return {
        type: SAVE_SETTINGS_IN_PROGRESS
    };
};

export const saveSettingsSuccess = (data) => {
    return {
        type: SAVE_SETTINGS_SUCCESS,
        payload: {data:data},
    };
};

export const saveSettingsFailure = (error) => {
    return {
        type: SAVE_SETTINGS_FAILURE,
        payload: error,
    };
};