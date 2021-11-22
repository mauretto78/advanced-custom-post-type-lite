import {wpAjaxRequest} from "../../utils/ajax";
import {assocTaxonomyToPostFailure, assocTaxonomyToPostInProgress, assocTaxonomyToPostSuccess} from "../actions/assocTaxonomyToPostActions";

export const assocTaxonomyToPostType = (postType, taxonomies) => async (dispatch, getState) => {
    try {
        dispatch(assocTaxonomyToPostInProgress());
        const res = await wpAjaxRequest("assocTaxonomyToPostTypeAction", {postType:postType, taxonomies:taxonomies});
        (res.success === true) ? dispatch(assocTaxonomyToPostSuccess()) : dispatch(assocTaxonomyToPostFailure(res.error)) ;
    } catch (e) {
        console.log(e);
        dispatch(assocTaxonomyToPostFailure(e));
    }
};