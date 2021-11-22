import {wpAjaxRequest} from "../../utils/ajax";
import {fetchTaxonomiesCountFailure, fetchTaxonomiesCountInProgress, fetchTaxonomiesCountSuccess} from "../actions/fetchTaxonomiesCountActions";

export const fetchTaxonomiesCount = () => async (dispatch, getState) => {
    try {
        dispatch(fetchTaxonomiesCountInProgress());
        const fetched = await wpAjaxRequest('fetchTaxonomiesCountAction' );
        dispatch(fetchTaxonomiesCountSuccess(fetched));
    } catch ( e ) {
        dispatch(fetchTaxonomiesCountFailure(e));
    }
};