import {
    FETCH_WOOCOMMERCE_PRODUCT_DATA_FAILURE,
    FETCH_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS,
    FETCH_WOOCOMMERCE_PRODUCT_DATA_RESET_IN_PROGRESS,
    FETCH_WOOCOMMERCE_PRODUCT_DATA_RESET_SUCCESS,
    FETCH_WOOCOMMERCE_PRODUCT_DATA_SUCCESS
} from "../actions/fetchWooCommerceProductDataActions";

const initialState = {
    fetched: [],
    loading: false,
    errors: {}
};

export const fetchWooCommerceProductDataReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        case FETCH_WOOCOMMERCE_PRODUCT_DATA_RESET_IN_PROGRESS:
            console.log('post Woocommerce product data in progress...');

            return {
                ...state,
                loading: true
            };

        case FETCH_WOOCOMMERCE_PRODUCT_DATA_RESET_SUCCESS:
            return initialState;

        case FETCH_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS:
            console.log('fetching of Woocommerce product data in progress...');

            return {
                ...state,
                loading: true
            };

        case FETCH_WOOCOMMERCE_PRODUCT_DATA_FAILURE:
            console.error(payload);
            return {
                ...state,
                loading: false,
                errors: payload
            };

        case FETCH_WOOCOMMERCE_PRODUCT_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                fetched: payload.data
            };
    }

    return state;
};