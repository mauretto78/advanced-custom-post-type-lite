export const FETCH_SETTINGS_IN_PROGRESS = 'FETCH_SETTINGS_IN_PROGRESS';
export const FETCH_SETTINGS_SUCCESS = 'FETCH_SETTINGS_SUCCESS';
export const FETCH_SETTINGS_FAILURE = 'FETCH_SETTINGS_FAILURE';

export const fetchSettingsInProgress = () => {
    return {
        type: FETCH_SETTINGS_IN_PROGRESS
    };
};

export const fetchSettingsSuccess = (data) => {
    return {
        type: FETCH_SETTINGS_SUCCESS,
        payload: {data:data},
    };
};

export const fetchSettingsFailure = (error) => {
    return {
        type: FETCH_SETTINGS_FAILURE,
        payload: JSON.parse(error.message),
    };
};