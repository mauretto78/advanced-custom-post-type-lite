import {wpAjaxRequest} from "../../utils/ajax";
import {saveSettingsFailure, saveSettingsInProgress, saveSettingsSuccess} from "../actions/saveSettingsActions";

export const saveSettings = (data) => async ( dispatch, getState) => {
    try {
        dispatch(saveSettingsInProgress());
        const res = await wpAjaxRequest('saveSettingsAction', data );
        (res.success === true) ? dispatch(saveSettingsSuccess(res.data)) : dispatch(saveSettingsFailure(res.error)) ;
    } catch ( e ) {
        dispatch(saveSettingsFailure(e));
    }
};