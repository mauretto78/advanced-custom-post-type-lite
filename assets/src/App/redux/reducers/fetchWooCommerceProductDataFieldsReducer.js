import {
    FETCH_WOOCOMMERCE_PRODUCT_DATA_FIELDS_FAILURE,
    FETCH_WOOCOMMERCE_PRODUCT_DATA_FIELDS_IN_PROGRESS,
    FETCH_WOOCOMMERCE_PRODUCT_DATA_FIELDS_SUCCESS
} from "../actions/fetchWooCommerceProductDataFieldsActions";

const initialState = {
    fetched: [],
    loading: false,
    errors: {}
};

export const fetchWooCommerceProductDataFieldsReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case FETCH_WOOCOMMERCE_PRODUCT_DATA_FIELDS_IN_PROGRESS:
            console.log('fetching of WooCommerce product data fields in progress...');

            return {
                ...state,
                loading: true
            };

        case FETCH_WOOCOMMERCE_PRODUCT_DATA_FIELDS_FAILURE:
            console.error(payload);
            return {
                ...state,
                loading: false,
                errors: payload
            };

        case FETCH_WOOCOMMERCE_PRODUCT_DATA_FIELDS_SUCCESS:
            return {
                ...state,
                loading: false,
                fetched: payload.data
            };
    }

    return state;
};