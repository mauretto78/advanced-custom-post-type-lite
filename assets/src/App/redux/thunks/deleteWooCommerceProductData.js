import {wpAjaxRequest} from "../../utils/ajax";
import {deleteWooCommerceProductDataFailure, deleteWooCommerceProductDataInProgress, deleteWooCommerceProductDataSuccess} from "../actions/deleteWooCommerceProductDataActions";

export const deleteWooCommerceProductData = (id) => async (dispatch, getState) => {
    try {
        dispatch(deleteWooCommerceProductDataInProgress(id));
        const res = await wpAjaxRequest('deleteWooCommerceProductDataAction', {id: id} );
        (res.success === true) ? dispatch(deleteWooCommerceProductDataSuccess()) : dispatch(deleteWooCommerceProductDataFailure(res.error)) ;
    } catch ( e ) {
        dispatch(deleteWooCommerceProductDataFailure(e));
    }
};
