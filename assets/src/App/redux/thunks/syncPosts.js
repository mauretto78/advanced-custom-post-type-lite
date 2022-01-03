import {wpAjaxRequest} from "../../utils/ajax";
import {syncPostsFailure, syncPostsInProgress, syncPostsSuccess} from "../actions/syncPostsAction";

export const syncPosts = () => async (dispatch, getState) => {
    try {
        dispatch(syncPostsInProgress());
        const res = await wpAjaxRequest("syncPostsAction");
        (res.success === true) ? dispatch(syncPostsSuccess(res.data)) : dispatch(syncPostsFailure(res.error)) ;
    } catch (e) {
        console.log(e);
        dispatch(syncPostsFailure(e));
    }
};