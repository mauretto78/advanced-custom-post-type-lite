import {wpAjaxRequest} from "../../utils/ajax";
import {deletePostTypeTemplateFailure, deletePostTypeTemplateInProgress, deletePostTypeTemplateSuccess} from "../actions/deletePostTypeTemplateActions";

export const deletePostTypeTemplate = ( postType, templateType) => async ( dispatch, getState) => {
    try {
        dispatch(deletePostTypeTemplateInProgress(postType, templateType));
        const res = await wpAjaxRequest('deletePostTypeTemplateAction', postType ? {postType:postType, templateType:templateType} : {} );
        (res.success === true) ? dispatch(deletePostTypeTemplateSuccess()) : dispatch(deletePostTypeTemplateFailure(res.error)) ;
    } catch ( e ) {
        dispatch(deletePostTypeTemplateFailure(e));
    }
};
