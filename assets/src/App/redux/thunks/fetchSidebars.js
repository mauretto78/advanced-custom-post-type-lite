import {wpAjaxRequest} from "../../utils/ajax";
import {fetchSidebarsFailure, fetchSidebarsInProgress, fetchSidebarsSuccess} from "../actions/fetchSidebarsActions";

export const fetchSidebars = () => async (dispatch, getState) => {
    try {
        dispatch(fetchSidebarsInProgress());
        const fetched = await wpAjaxRequest('fetchSidebarsAction', {} );
        dispatch(fetchSidebarsSuccess(fetched));
    } catch ( e ) {
        dispatch(fetchSidebarsFailure(e));
    }
};
