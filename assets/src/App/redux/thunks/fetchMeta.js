import {wpAjaxRequest} from "../../utils/ajax";
import {fetchMetaFailure, fetchMetaInProgress, fetchMetaSuccess} from "../actions/fetchMetaActions";
import {hydrateValues} from "../actions/metaStateActions";

export const fetchMeta = (postType) => async (dispatch, getState) => {
    try {
        dispatch(fetchMetaInProgress());
        const fetched = await wpAjaxRequest('fetchCustomPostTypeMetaAction', {postType:postType});
        dispatch(fetchMetaSuccess(fetched));
        dispatch(hydrateValues(fetched));
    } catch ( e ) {
        dispatch(fetchMetaFailure(e));
    }
};
