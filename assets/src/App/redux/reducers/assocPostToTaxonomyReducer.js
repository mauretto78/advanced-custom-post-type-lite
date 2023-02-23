import {
    ASSOC_POST_TO_TAXONOMY_FAILURE,
    ASSOC_POST_TO_TAXONOMY_IN_PROGRESS,
    ASSOC_POST_TO_TAXONOMY_SUCCESS
} from "../actions/assocPostToTaxonomyActions";

const initialState = {
    success: false,
    loading: false,
    errors: []
};

export const assocPostToTaxonomyReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case ASSOC_POST_TO_TAXONOMY_IN_PROGRESS:
            console.log('Associating custom post type to taxonomy in progress...');

            return {
                ...state,
                success: false,
                loading: true
            };

        case ASSOC_POST_TO_TAXONOMY_FAILURE:
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

        case ASSOC_POST_TO_TAXONOMY_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                errors: []
            };
    }

    return state;
};