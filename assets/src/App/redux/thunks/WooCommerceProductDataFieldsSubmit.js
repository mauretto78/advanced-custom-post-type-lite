import {wpAjaxRequest} from "../../utils/ajax";
import {submitWooCommerceProductDataFieldsFailure, submitWooCommerceProductDataFieldsInProgress, submitWooCommerceProductDataFieldsSuccess} from "../actions/WooCommerceFieldsStateAction";

export const WooCommerceProductDataFieldsSubmit = (data) => async (dispatch, getState) => {
    try {
        dispatch(submitWooCommerceProductDataFieldsInProgress());
        const res = await wpAjaxRequest("saveWooCommerceProductDataFieldsAction", data);
        (res.success === true) ? dispatch(submitWooCommerceProductDataFieldsSuccess()) : dispatch(submitWooCommerceProductDataFieldsFailure(res.error)) ;
    } catch (e) {
        console.log(e);
        dispatch(submitWooCommerceProductDataFieldsFailure(e));
    }
};