import {wpAjaxRequest} from "../../utils/ajax";
import {resetWooCommerceProductDataInProgress, resetWooCommerceProductDataSuccess} from "../actions/fetchWooCommerceProductDataActions";

export const resetWooCommerceProductData = () => async (dispatch, getState) => {
    dispatch(resetWooCommerceProductDataInProgress());
    const fetched = await wpAjaxRequest('resetWooCommerceProductDataAction' );
    dispatch(resetWooCommerceProductDataSuccess());
};
