import {wpAjaxRequest} from "../../utils/ajax";
import {submitFailure, submitInProgress, submitSuccess} from "../actions/metaStateActions";

export const metaSubmit = (data) => async (dispatch, getState) => {
    try {
        dispatch(submitInProgress());
        const res = await wpAjaxRequest("saveCustomPostTypeMetaAction", data);
        (res.success === true) ? dispatch(submitSuccess()) : dispatch(submitFailure(res.error)) ;
    } catch (e) {
        console.log(e);
        dispatch(submitFailure(e));
    }
};