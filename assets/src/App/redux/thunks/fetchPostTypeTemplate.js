import {wpAjaxRequest} from "../../utils/ajax";
import {fetchPostTypeTemplateFailure, fetchPostTypeTemplateInProgress, fetchPostTypeTemplateSuccess} from "../actions/fetchCustomPostTypeTemplateActions";

export const fetchPostTypeTemplate = ( postType, templateType) => async ( dispatch, getState) => {
    try {
        dispatch(fetchPostTypeTemplateInProgress());
        const fetched = await wpAjaxRequest('fetchCustomPostTypeTemplateAction', {postType:postType, templateType:templateType} );
        dispatch(fetchPostTypeTemplateSuccess(fetched));
    } catch ( e ) {
        dispatch(fetchPostTypeTemplateFailure(e));
    }
};