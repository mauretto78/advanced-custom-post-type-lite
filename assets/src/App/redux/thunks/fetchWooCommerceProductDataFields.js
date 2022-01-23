import {wpAjaxRequest} from "../../utils/ajax";
import {fetchWooCommerceProductDataFieldsFailure, fetchWooCommerceProductDataFieldsInProgress, fetchWooCommerceProductDataFieldsSuccess} from "../actions/fetchWooCommerceProductDataFieldsActions";
import {hydrateWooCommerceProductDataValues} from "../actions/WooCommerceFieldsStateAction";

export const fetchWooCommerceProductDataFields = (id) => async (dispatch, getState) => {
    try {
        dispatch(fetchWooCommerceProductDataFieldsInProgress());
        const fetched = await wpAjaxRequest('fetchWooCommerceProductDataFieldsAction', {id:id});
        dispatch(fetchWooCommerceProductDataFieldsSuccess(fetched));
        dispatch(hydrateWooCommerceProductDataValues(fetched));
    } catch ( e ) {
        dispatch(fetchWooCommerceProductDataFieldsFailure(e));
    }
};
