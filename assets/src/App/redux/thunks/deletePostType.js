import {wpAjaxRequest} from "../../utils/ajax";
import {deletePostTypeFailure, deletePostTypeInProgress, deletePostTypeSuccess} from "../actions/deleteCustomPostTypeActions";

export const deletePostType = (postType, mode) => async (dispatch, getState) => {
    try {
        dispatch(deletePostTypeInProgress(postType, mode));
        const res = await wpAjaxRequest('deleteCustomPostTypeAction', postType ? {postType:postType, mode:mode} : {} );
        (res.success === true) ? dispatch(deletePostTypeSuccess()) : dispatch(deletePostTypeFailure(res.error)) ;
    } catch ( e ) {
        dispatch(deletePostTypeFailure(e));
    }
};
