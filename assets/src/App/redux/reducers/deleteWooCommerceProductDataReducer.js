import {DELETE_WOOCOMMERCE_PRODUCT_DATA_FAILURE, DELETE_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS, DELETE_WOOCOMMERCE_PRODUCT_DATA_SUCCESS} from "../actions/deleteWooCommerceProductDataActions";

const initialState = {
    success: false,
    loading: false,
    errors: []
};

export const deleteWooCommerceProductDataReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case DELETE_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS:
            console.log('deleting WooCommerce product data in progress...');

            return {
                ...state,
                success: false,
                loading: true
            };

        case DELETE_WOOCOMMERCE_PRODUCT_DATA_FAILURE:
            console.error(payload);

            const prevErrors = (state.errors.length > 0) ? state.errors : [];
            if(!prevErrors.includes(payload.error)){
                prevErrors.push(payload.error);
            }

            return {
                ...state,
                loading: false,
                success: false,
                errors: prevErrors
            };

        case DELETE_WOOCOMMERCE_PRODUCT_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                errors: []
            };
    }

    return state;
};