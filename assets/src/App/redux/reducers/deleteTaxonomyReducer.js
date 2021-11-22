import {DELETE_TAXONOMY_FAILURE, DELETE_TAXONOMY_IN_PROGRESS, DELETE_TAXONOMY_SUCCESS} from "../actions/deleteTaxonomyActions";

const initialState = {
    success: false,
    loading: false,
    errors: []
};

export const deleteTaxonomyReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case DELETE_TAXONOMY_IN_PROGRESS:
            console.log('deleting taxonomy in progress...');

            return {
                ...state,
                success: false,
                loading: true
            };

        case DELETE_TAXONOMY_FAILURE:
            console.error(payload);

            const prevErrors = (state.errors.length > 0) ? state.errors : [];
            if(!prevErrors.includes(payload.error)){
                prevErrors.push(payload.error);
            }

            return {
                ...state,
                loading: false,
                success: false,
                errors: prevErrors
            };

        case DELETE_TAXONOMY_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                errors: []
            };
    }

    return state;
};