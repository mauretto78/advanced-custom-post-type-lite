import {wpAjaxRequest} from "../../utils/ajax";
import {fetchInversedMetaFailure, fetchInversedMetaInProgress, fetchInversedMetaSuccess} from "../actions/fetchInversedMetaActions";

export const fetchInversedMeta = (postType, excludeField) => async (dispatch, getState) => {
    try {
        dispatch(fetchInversedMetaInProgress());
        const fetched = await wpAjaxRequest('fetchCustomPostTypeMetaAction', {postType:postType, excludeField:excludeField});
        dispatch(fetchInversedMetaSuccess(fetched));
    } catch ( e ) {
        dispatch(fetchInversedMetaFailure(e));
    }
};
