import {wpAjaxRequest} from "../../utils/ajax";
import {saveWooCommerceProductDataFailure, saveWooCommerceProductDataInProgress, saveWooCommerceProductDataSuccess} from "../actions/saveWooCommerceProductDataActions";

export const saveWooCommerceProductData = (data) => async ( dispatch, getState) => {
    try {
        dispatch(saveWooCommerceProductDataInProgress());
        const res = await wpAjaxRequest('saveWooCommerceProductDataAction', data );
        (res.success === true) ? dispatch(saveWooCommerceProductDataSuccess(res.data)) : dispatch(saveWooCommerceProductDataFailure(res.error)) ;
    } catch ( e ) {
        dispatch(saveWooCommerceProductDataFailure(e));
    }
};