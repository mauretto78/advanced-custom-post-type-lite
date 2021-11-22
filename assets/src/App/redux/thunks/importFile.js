import {wpAjaxRequest} from "../../utils/ajax";
import {importFileFailure, importFileInProgress, importFileSuccess} from "../actions/importFileActions";

export const importFile = (data) => async (dispatch, getState) => {
    try {
        dispatch(importFileInProgress());
        const res = await wpAjaxRequest("importFileAction", data);
        (res.success === true) ? dispatch(importFileSuccess(res.data)) : dispatch(importFileFailure(res.error)) ;
    } catch (e) {
        console.log(e);
        dispatch(importFileFailure(e));
    }
};