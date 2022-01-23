import {wpAjaxRequest} from "../../utils/ajax";
import {deleteAllWooCommerceProductDataFieldsFailure, deleteAllWooCommerceProductDataFieldsInProgress, deleteAllWooCommerceProductDataFieldsSuccess} from "../actions/WooCommerceFieldsStateAction";

export const deleteAllWooCommerceProductDataFields = (id) => async (dispatch, getState) => {
    try {
        dispatch(deleteAllWooCommerceProductDataFieldsInProgress());
        const res = await wpAjaxRequest("deleteWooCommerceProductDataFieldsAction", {id:id});
        (res.success === true) ? dispatch(deleteAllWooCommerceProductDataFieldsSuccess()) : dispatch(deleteAllWooCommerceProductDataFieldsFailure(res.error)) ;
    } catch (e) {
        console.log(e);
        dispatch(deleteAllWooCommerceProductDataFieldsFailure(e));
    }
};