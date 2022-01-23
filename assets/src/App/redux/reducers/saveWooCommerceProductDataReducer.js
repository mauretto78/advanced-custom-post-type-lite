import {SAVE_WOOCOMMERCE_PRODUCT_DATA_FAILURE, SAVE_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS, SAVE_WOOCOMMERCE_PRODUCT_DATA_SUCCESS} from "../actions/saveWooCommerceProductDataActions";

const initialState = {
    success: false,
    loading: false,
    errors: []
};

export const saveWooCommerceProductDataReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case SAVE_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS:
            console.log('Saving WooCommerce product data in progress...');

            return {
                ...state,
                success: false,
                loading: true
            };

        case SAVE_WOOCOMMERCE_PRODUCT_DATA_FAILURE:
            console.error(payload);

            const prevErrors = (state.errors.length > 0) ? state.errors : [];
            if(!prevErrors.includes(payload)){
                prevErrors.push(payload);
            }

            return {
                ...state,
                loading: false,
                success: false,
                errors: prevErrors
            };

        case SAVE_WOOCOMMERCE_PRODUCT_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                errors: []
            };
    }

    return state;
};