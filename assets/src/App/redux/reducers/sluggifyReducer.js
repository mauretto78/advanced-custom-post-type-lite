import {SLUGGIFY_FAILURE, SLUGGIFY_IN_PROGRESS, SLUGGIFY_SUCCESS} from "../actions/sluggifyActions";

const initialState = {
    string: null,
    loading: false,
    errors: []
};

export const sluggifyReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case SLUGGIFY_IN_PROGRESS:
            console.log('Sluggify in progress...');

            return {
                ...state,
                success: false,
                loading: true
            };

        case SLUGGIFY_FAILURE:
            console.error(payload);

            const prevErrors = (state.errors.length > 0) ? state.errors : [];
            if(!prevErrors.includes(payload)){
                prevErrors.push(payload);
            }

            return {
                ...state,
                loading: false,
                string: null,
                errors: prevErrors
            };

        case SLUGGIFY_SUCCESS:
            return {
                ...state,
                loading: false,
                string: payload.string,
                errors: []
            };
    }

    return state;
};