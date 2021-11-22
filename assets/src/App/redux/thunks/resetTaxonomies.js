import {wpAjaxRequest} from "../../utils/ajax";
import {resetTaxonomiesInProgress, resetTaxonomiesSuccess} from "../actions/fetchTaxonomiesActions";

export const resetTaxonomies = () => async (dispatch, getState) => {
    dispatch(resetTaxonomiesInProgress());
    const fetched = await wpAjaxRequest('resetTaxonomiesAction' );
    dispatch(resetTaxonomiesSuccess());
};
