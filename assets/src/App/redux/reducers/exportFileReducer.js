import {EXPORT_FILE_FAILURE, EXPORT_FILE_IN_PROGRESS, EXPORT_FILE_SUCCESS} from "../actions/exportFileActions";

const initialState = {
    content: null,
    success: null,
    loading: false,
    errors: []
};

export const exportFileReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case EXPORT_FILE_IN_PROGRESS:
            console.log('exporting file in progress...');

            return {
                ...state,
                loading: true
            };

        case EXPORT_FILE_FAILURE:
            console.error(payload);

            let errors = [];
            errors.push(payload);

            return {
                ...state,
                success: false,
                loading: false,
                errors: errors
            };

        case EXPORT_FILE_SUCCESS:
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