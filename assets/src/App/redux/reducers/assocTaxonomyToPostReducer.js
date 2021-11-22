import {ASSOC_TAXONOMY_TO_POST_FAILURE, ASSOC_TAXONOMY_TO_POST_IN_PROGRESS, ASSOC_TAXONOMY_TO_POST_SUCCESS} from "../actions/assocTaxonomyToPostActions";

const initialState = {
    success: false,
    loading: false,
    errors: []
};

export const assocTaxonomyToPostReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case ASSOC_TAXONOMY_TO_POST_IN_PROGRESS:
            console.log('Associating taxonomiies to custom post type in progress...');

            return {
                ...state,
                success: false,
                loading: true
            };

        case ASSOC_TAXONOMY_TO_POST_FAILURE:
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

        case ASSOC_TAXONOMY_TO_POST_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                errors: []
            };
    }

    return state;
};