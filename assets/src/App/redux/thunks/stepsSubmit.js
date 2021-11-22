import {stepsSubmitFailure, stepsSubmitInProgress, stepsSubmitSuccess} from "../actions/stepsActions";
import {wpAjaxRequest} from "../../utils/ajax";

export const stepsSubmit = (action, data) => async (dispatch, getState) => {
    try {
        dispatch(stepsSubmitInProgress(data));
        const res = await wpAjaxRequest(action, getState().stepsReducer.data);
        (res.success === true) ? dispatch(stepsSubmitSuccess()) : dispatch(stepsSubmitFailure(res.error)) ;
    } catch (e) {
        console.log(e);
        dispatch(stepsSubmitFailure(e));
    }
};
