export const SAVE_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS = 'SAVE_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS';
export const SAVE_WOOCOMMERCE_PRODUCT_DATA_SUCCESS = 'SAVE_WOOCOMMERCE_PRODUCT_DATA_SUCCESS';
export const SAVE_WOOCOMMERCE_PRODUCT_DATA_FAILURE = 'SAVE_WOOCOMMERCE_PRODUCT_DATA_FAILURE';

export const saveWooCommerceProductDataInProgress = () => {
    return {
        type: SAVE_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS
    };
};

export const saveWooCommerceProductDataSuccess = (data) => {
    return {
        type: SAVE_WOOCOMMERCE_PRODUCT_DATA_SUCCESS,
        payload: {data:data},
    };
};

export const saveWooCommerceProductDataFailure = (error) => {
    return {
        type: SAVE_WOOCOMMERCE_PRODUCT_DATA_FAILURE,
        payload: error,
    };
};