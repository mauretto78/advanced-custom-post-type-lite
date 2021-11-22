import {wpAjaxRequest} from "../../utils/ajax";
import {fetchSettingsFailure, fetchSettingsInProgress, fetchSettingsSuccess} from "../actions/fetchSettingsActions";

export const fetchSettings = () => async (dispatch, getState) => {
    try {
        dispatch(fetchSettingsInProgress());
        const fetched = await wpAjaxRequest('fetchSettingsAction', {});
        dispatch(fetchSettingsSuccess(fetched));
    } catch ( e ) {
        dispatch(fetchSettingsFailure(e));
    }
};