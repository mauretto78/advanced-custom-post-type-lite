import {wpAjaxRequest} from "../../utils/ajax";
import {submitUserMetaFailure, submitUserMetaInProgress, submitUserMetaSuccess} from "../actions/userMetaStateActions";

export const userMetaSubmit = (data) => async (dispatch, getState) => {
    try {
        dispatch(submitUserMetaInProgress());
        const res = await wpAjaxRequest("saveUserMetaAction", data);
        (res.success === true) ? dispatch(submitUserMetaSuccess()) : dispatch(submitUserMetaFailure(res.error)) ;
    } catch (e) {
        console.log(e);
        dispatch(submitUserMetaFailure(e));
    }
};