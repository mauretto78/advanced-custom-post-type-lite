import {wpAjaxRequest} from "../../utils/ajax";
import {
    assocPostTypeToTaxonomyFailure,
    assocPostTypeToTaxonomyInProgress,
    assocPostTypeToTaxonomySuccess
} from "../actions/assocPostToTaxonomyActions";

export const assocPostTypeToTaxonomy = (taxonomy, postTypes) => async (dispatch, getState) => {
    try {
        dispatch(assocPostTypeToTaxonomyInProgress());
        const res = await wpAjaxRequest("assocPostTypeToTaxonomyAction", {taxonomy:taxonomy, postTypes:postTypes});
        (res.success === true) ? dispatch(assocPostTypeToTaxonomySuccess()) : dispatch(assocPostTypeToTaxonomyFailure(res.error)) ;
    } catch (e) {
        console.log(e);
        dispatch(assocPostTypeToTaxonomyFailure(e));
    }
};