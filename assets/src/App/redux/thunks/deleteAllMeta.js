import {wpAjaxRequest} from "../../utils/ajax";
import {deleteAllFailure, deleteAllInProgress, deleteAllSuccess} from "../actions/metaStateActions";

export const deleteAllMeta = (postType) => async (dispatch, getState) => {
    try {
        dispatch(deleteAllInProgress());
        const res = await wpAjaxRequest("deleteCustomPostTypeMetaAction", {postType:postType});
        (res.success === true) ? dispatch(deleteAllSuccess()) : dispatch(deleteAllFailure(res.error)) ;
    } catch (e) {
        console.log(e);
        dispatch(deleteAllFailure(e));
    }
};