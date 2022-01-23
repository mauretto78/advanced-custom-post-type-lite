export const FETCH_WOOCOMMERCE_PRODUCT_DATA_FIELDS_IN_PROGRESS = 'FETCH_WOOCOMMERCE_PRODUCT_DATA_FIELDS_IN_PROGRESS';
export const FETCH_WOOCOMMERCE_PRODUCT_DATA_FIELDS_SUCCESS = 'FETCH_WOOCOMMERCE_PRODUCT_DATA_FIELDS_SUCCESS';
export const FETCH_WOOCOMMERCE_PRODUCT_DATA_FIELDS_FAILURE = 'FETCH_WOOCOMMERCE_PRODUCT_DATA_FIELDS_FAILURE';

export const fetchWooCommerceProductDataFieldsInProgress = () => {
    return {
        type: FETCH_WOOCOMMERCE_PRODUCT_DATA_FIELDS_IN_PROGRESS
    };
};

export const fetchWooCommerceProductDataFieldsSuccess = (data) => {
    return {
        type: FETCH_WOOCOMMERCE_PRODUCT_DATA_FIELDS_SUCCESS,
        payload: {data:data},
    };
};

export const fetchWooCommerceProductDataFieldsFailure = (error) => {
    return {
        type: FETCH_WOOCOMMERCE_PRODUCT_DATA_FIELDS_FAILURE,
        payload: JSON.parse(error.message),
    };
};
