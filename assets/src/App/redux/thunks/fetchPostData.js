import {wpAjaxRequest} from "../../utils/ajax";
import {fetchPostDataFailure, fetchPostDataInProgress, fetchPostDataSuccess} from "../actions/fetchPostDataActions";

export const fetchPostData = (id) => async (dispatch, getState) => {
    try {
        dispatch(fetchPostDataInProgress());
        const fetched = await wpAjaxRequest('fetchPostDataAction', {id:id});
        dispatch(fetchPostDataSuccess(fetched));
    } catch ( e ) {
        dispatch(fetchPostDataFailure(e));
    }
};