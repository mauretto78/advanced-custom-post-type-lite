import {wpAjaxRequest} from "../../utils/ajax";
import {fetchUserMetaFailure, fetchUserMetaInProgress, fetchUserMetaSuccess} from "../actions/fetchUserMetaActions";
import {hydrateUserMetaValues} from "../actions/userMetaStateActions";

export const fetchUserMeta = () => async (dispatch, getState) => {
    try {
        dispatch(fetchUserMetaInProgress());
        const fetched = await wpAjaxRequest('fetchUserMetaAction', {});
        dispatch(fetchUserMetaSuccess(fetched));
        dispatch(hydrateUserMetaValues(fetched));
    } catch ( e ) {
        dispatch(fetchUserMetaFailure(e));
    }
};