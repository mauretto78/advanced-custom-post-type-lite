import {SAVE_SETTINGS_FAILURE, SAVE_SETTINGS_IN_PROGRESS, SAVE_SETTINGS_SUCCESS} from "../actions/saveSettingsActions";

const initialState = {
    success: false,
    loading: false,
    errors: []
};

export const saveSettingsReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case SAVE_SETTINGS_IN_PROGRESS:
            console.log('Saving settings in progress...');

            return {
                ...state,
                success: false,
                loading: true
            };

        case SAVE_SETTINGS_FAILURE:
            console.error(payload);

            const prevErrors = (state.errors.length > 0) ? state.errors : [];
            if(!prevErrors.includes(payload)){
                prevErrors.push(payload);
            }

            return {
                ...state,
                loading: false,
                success: false,
                errors: prevErrors
            };

        case SAVE_SETTINGS_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                errors: []
            };
    }

    return state;
};