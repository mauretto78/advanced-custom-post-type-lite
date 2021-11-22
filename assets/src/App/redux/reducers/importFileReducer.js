import {IMPORT_FILE_FAILURE, IMPORT_FILE_IN_PROGRESS, IMPORT_FILE_SUCCESS} from "../actions/importFileActions";

const initialState = {
    content: null,
    success: null,
    loading: false,
    errors: []
};

export const importFileReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case IMPORT_FILE_IN_PROGRESS:
            console.log('importing file in progress...');

            return {
                ...state,
                loading: true
            };

        case IMPORT_FILE_FAILURE:
            console.error(payload);

            let errors = [];
            errors.push(payload);

            return {
                ...state,
                success: false,
                loading: false,
                errors: errors
            };

        case IMPORT_FILE_SUCCESS:
            return {
                ...state,
                success: true,
                loading: false,
                content: payload.data,
                errors: []
            };
    }

    return state;
};