import {wpAjaxRequest} from "../../utils/ajax";
import {fetchWooCommerceProductDataFailure, fetchWooCommerceProductDataInProgress, fetchWooCommerceProductDataSuccess} from "../actions/fetchWooCommerceProductDataActions";

export const fetchWooCommerceProductData = (meta) => async (dispatch, getState) => {
    try {
        dispatch(fetchWooCommerceProductDataInProgress());
        const fetched = await wpAjaxRequest('fetchWooCommerceProductDataAction', meta);
        dispatch(fetchWooCommerceProductDataSuccess(fetched));
    } catch ( e ) {
        dispatch(fetchWooCommerceProductDataFailure(e));
    }
};