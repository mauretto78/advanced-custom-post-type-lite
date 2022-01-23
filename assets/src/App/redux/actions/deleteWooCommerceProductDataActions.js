export const DELETE_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS = 'DELETE_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS';
export const DELETE_WOOCOMMERCE_PRODUCT_DATA_SUCCESS = 'DELETE_WOOCOMMERCE_PRODUCT_DATA_SUCCESS';
export const DELETE_WOOCOMMERCE_PRODUCT_DATA_FAILURE = 'DELETE_WOOCOMMERCE_PRODUCT_DATA_FAILURE';

export const deleteWooCommerceProductDataInProgress = (id) => {
    return {
        type: DELETE_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS,
        payload: {
            id: id
        }
    };
};

export const deleteWooCommerceProductDataSuccess = (data) => {
    return {
        type: DELETE_WOOCOMMERCE_PRODUCT_DATA_SUCCESS,
        payload: {data:data},
    };
};

export const deleteWooCommerceProductDataFailure = (error) => {
    return {
        type: DELETE_WOOCOMMERCE_PRODUCT_DATA_FAILURE,
        payload: JSON.parse(error.message),
    };
};
