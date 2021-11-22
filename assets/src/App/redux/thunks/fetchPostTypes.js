import {wpAjaxRequest} from "../../utils/ajax";
import {fetchPostTypesFailure, fetchPostTypesInProgress, fetchPostTypesSuccess} from "../actions/fetchCustomPostTypesActions";

export const fetchPostTypes = (meta) => async (dispatch, getState) => {
    try {
        dispatch(fetchPostTypesInProgress(meta));
        const fetched = await wpAjaxRequest('fetchCustomPostTypesAction', meta ? meta : {} );
        dispatch(fetchPostTypesSuccess(fetched));
    } catch ( e ) {
        dispatch(fetchPostTypesFailure(e));
    }
};
