export const FETCH_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS = 'FETCH_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS';
export const FETCH_WOOCOMMERCE_PRODUCT_DATA_SUCCESS = 'FETCH_WOOCOMMERCE_PRODUCT_DATA_SUCCESS';
export const FETCH_WOOCOMMERCE_PRODUCT_DATA_FAILURE = 'FETCH_WOOCOMMERCE_PRODUCT_DATA_FAILURE';
export const FETCH_WOOCOMMERCE_PRODUCT_DATA_RESET_IN_PROGRESS = 'FETCH_WOOCOMMERCE_PRODUCT_DATA_RESET_IN_PROGRESS';
export const FETCH_WOOCOMMERCE_PRODUCT_DATA_RESET_SUCCESS = 'FETCH_WOOCOMMERCE_PRODUCT_DATA_RESET_SUCCESS';

export const resetWooCommerceProductDataInProgress = () => {
    return {
        type: FETCH_WOOCOMMERCE_PRODUCT_DATA_RESET_IN_PROGRESS
    };
};

export const resetWooCommerceProductDataSuccess = () => {
    return {
        type: FETCH_WOOCOMMERCE_PRODUCT_DATA_RESET_SUCCESS
    };
};

export const fetchWooCommerceProductDataInProgress = (meta) => {
    return {
        type: FETCH_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS,
        payload: {
            meta: meta
        }
    };
};

export const fetchWooCommerceProductDataSuccess = (data) => {
    return {
        type: FETCH_WOOCOMMERCE_PRODUCT_DATA_SUCCESS,
        payload: {data:data},
    };
};

export const fetchWooCommerceProductDataFailure = (error) => {
    return {
        type: FETCH_WOOCOMMERCE_PRODUCT_DATA_FAILURE,
        payload: JSON.parse(error.message),
    };
};
