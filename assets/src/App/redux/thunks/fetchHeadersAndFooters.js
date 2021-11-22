import {wpAjaxRequest} from "../../utils/ajax";
import {fetchHeadersAndFootersFailure, fetchHeadersAndFootersInProgress, fetchHeadersAndFootersSuccess} from "../actions/fetchHeadersAndFootersActions";

export const fetchHeadersAndFooters = () => async (dispatch, getState) => {
    try {
        dispatch(fetchHeadersAndFootersInProgress());
        const fetched = await wpAjaxRequest('fetchHeadersAndFootersAction', {} );
        dispatch(fetchHeadersAndFootersSuccess(fetched));
    } catch ( e ) {
        dispatch(fetchHeadersAndFootersFailure(e));
    }
};
