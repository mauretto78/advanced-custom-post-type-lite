import {wpAjaxRequest} from "../../utils/ajax";
import {deleteAllUserMetaFailure, deleteAllUserMetaInProgress, deleteAllUserMetaSuccess} from "../actions/userMetaStateActions";

export const deleteAllUserMeta = () => async (dispatch, getState) => {
    try {
        dispatch(deleteAllUserMetaInProgress());
        const res = await wpAjaxRequest("deleteUserMetaAction", {});
        (res.success === true) ? dispatch(deleteAllUserMetaSuccess()) : dispatch(deleteAllUserMetaFailure(res.error)) ;
    } catch (e) {
        console.log(e);
        dispatch(deleteAllUserMetaFailure(e));
    }
};