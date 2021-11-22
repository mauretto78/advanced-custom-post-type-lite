import {wpAjaxRequest} from "../../utils/ajax";
import {exportFileFailure, exportFileInProgress, exportFileSuccess} from "../actions/exportFileActions";

export const exportFile = (data) => async (dispatch, getState) => {
    try {
        dispatch(exportFileInProgress());
        const res = await wpAjaxRequest("exportFileAction", data);
        (res.success === true) ? dispatch(exportFileSuccess(res.data)) : dispatch(exportFileFailure(res.error)) ;
    } catch (e) {
        console.log(e);
        dispatch(exportFileFailure(e));
    }
};