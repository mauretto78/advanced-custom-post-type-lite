import {wpAjaxRequest} from "../../utils/ajax";
import {fetchMetaFailure, fetchMetaInProgress, fetchMetaSuccess} from "../actions/fetchMetaActions";
import {hydrateValues} from "../actions/metaStateActions";

export const fetchMeta = (belongsTo, find, metaFieldId) => async (dispatch, getState) => {
    try {
        dispatch(fetchMetaInProgress());
        const fetched = await wpAjaxRequest('fetchMetaAction', {belongsTo:belongsTo, find:find, metaFieldId:metaFieldId});
        dispatch(fetchMetaSuccess(fetched));
        dispatch(hydrateValues(fetched));
    } catch ( e ) {
        dispatch(fetchMetaFailure(e));
    }
};
