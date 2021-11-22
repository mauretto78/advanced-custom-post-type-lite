import {wpAjaxRequest} from "../../utils/ajax";
import {fetchTaxonomiesFailure, fetchTaxonomiesInProgress, fetchTaxonomiesSuccess} from "../actions/fetchTaxonomiesActions";

export const fetchTaxonomies = (meta) => async (dispatch, getState) => {
    try {
        dispatch(fetchTaxonomiesInProgress(meta));
        const fetched = await wpAjaxRequest('fetchTaxonomiesAction', meta ? meta : {} );
        dispatch(fetchTaxonomiesSuccess(fetched));
    } catch ( e ) {
        dispatch(fetchTaxonomiesFailure(e));
    }
};
