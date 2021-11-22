import {wpAjaxRequest} from "../../utils/ajax";
import {deleteTaxonomyFailure, deleteTaxonomyInProgress, deleteTaxonomySuccess} from "../actions/deleteTaxonomyActions";

export const deleteTaxonomy = (taxonomy) => async (dispatch, getState) => {
    try {
        dispatch(deleteTaxonomyInProgress(taxonomy));
        const res = await wpAjaxRequest('deleteTaxonomyAction', taxonomy ? {taxonomy:taxonomy} : {} );
        (res.success === true) ? dispatch(deleteTaxonomySuccess()) : dispatch(deleteTaxonomyFailure(res.error)) ;
    } catch ( e ) {
        dispatch(deleteTaxonomyFailure(e));
    }
};
