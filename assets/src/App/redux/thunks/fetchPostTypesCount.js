import {wpAjaxRequest} from "../../utils/ajax";
import {fetchPostTypesCountFailure, fetchPostTypesCountInProgress, fetchPostTypesCountSuccess} from "../actions/fetchCustomPostTypesCountActions";

export const fetchPostTypesCount = () => async (dispatch, getState) => {
    try {
        dispatch(fetchPostTypesCountInProgress());
        const fetched = await wpAjaxRequest('fetchCustomPostTypesCountAction' );
        dispatch(fetchPostTypesCountSuccess(fetched));
    } catch ( e ) {
        dispatch(fetchPostTypesCountFailure(e));
    }
};