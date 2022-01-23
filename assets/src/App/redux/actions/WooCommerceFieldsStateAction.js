export const CREATE_WOOCOMMERCE_PRODUCT_DATA_FIELD = 'CREATE_WOOCOMMERCE_PRODUCT_DATA_FIELD';
export const CREATE_WOOCOMMERCE_PRODUCT_DATA_OPTION = 'CREATE_WOOCOMMERCE_PRODUCT_DATA_OPTION';
export const DELETE_ALL_WOOCOMMERCE_PRODUCT_DATA_FAILURE = 'DELETE_ALL_WOOCOMMERCE_PRODUCT_DATA_FAILURE';
export const DELETE_ALL_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS = 'DELETE_ALL_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS';
export const DELETE_ALL_WOOCOMMERCE_PRODUCT_DATA_SUCCESS = 'DELETE_ALL_WOOCOMMERCE_PRODUCT_DATA_SUCCESS';
export const DELETE_WOOCOMMERCE_PRODUCT_DATA_FIELD = 'DELETE_WOOCOMMERCE_PRODUCT_DATA_FIELD';
export const DELETE_WOOCOMMERCE_PRODUCT_DATA_OPTION = 'DELETE_WOOCOMMERCE_PRODUCT_DATA_OPTION';
export const HYDRATE_WOOCOMMERCE_PRODUCT_DATA_VALUES = 'HYDRATE_WOOCOMMERCE_PRODUCT_DATA_VALUES';
export const SET_WOOCOMMERCE_PRODUCT_DATA_FIELDS = 'SET_WOOCOMMERCE_PRODUCT_DATA_FIELDS';
export const SET_WOOCOMMERCE_PRODUCT_DATA_OPTIONS = 'SET_WOOCOMMERCE_PRODUCT_DATA_OPTIONS';
export const SET_WOOCOMMERCE_PRODUCT_DATA_STATUS_INVALID = 'SET_WOOCOMMERCE_PRODUCT_DATA_STATUS_INVALID';
export const SET_WOOCOMMERCE_PRODUCT_DATA_STATUS_SAVED = 'SET_WOOCOMMERCE_PRODUCT_DATA_STATUS_SAVED';
export const SET_WOOCOMMERCE_PRODUCT_DATA_STATUS_VALID = 'SET_WOOCOMMERCE_PRODUCT_DATA_STATUS_VALID';
export const SUBMIT_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS = 'SUBMIT_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS';
export const SUBMIT_WOOCOMMERCE_PRODUCT_DATA_SUCCESS = 'SUBMIT_WOOCOMMERCE_PRODUCT_DATA_SUCCESS';
export const SUBMIT_WOOCOMMERCE_PRODUCT_DATA_FAILURE = 'SUBMIT_WOOCOMMERCE_PRODUCT_DATA_FAILURE';
export const TOGGLE_WOOCOMMERCE_PRODUCT_DATA_FIELD_IS_REQUIRED = 'TOGGLE_WOOCOMMERCE_PRODUCT_DATA_FIELD_IS_REQUIRED';
export const UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_NAME = 'UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_NAME';
export const UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_DEFAULT_VALUE = 'UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_DEFAULT_VALUE';
export const UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_DESCRIPTION = 'UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_DESCRIPTION';
export const UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_TYPE = 'UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_TYPE';
export const UPDATE_WOOCOMMERCE_PRODUCT_DATA_OPTION_LABEL = 'UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_LABEL';
export const UPDATE_WOOCOMMERCE_PRODUCT_DATA_OPTION_VALUE = 'UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_VALUE';

export const createWooCommerceProductDataField = (postDataId) => {
    return {
        type: CREATE_WOOCOMMERCE_PRODUCT_DATA_FIELD,
        payload: {
            postDataId:postDataId
        },
    };
};

export const createWooCommerceProductDataFieldOption = (fieldId) => {
    return {
        type: CREATE_WOOCOMMERCE_PRODUCT_DATA_OPTION,
        payload: {
            fieldId: fieldId
        },
    };
};

export const deleteAllWooCommerceProductDataFieldsInProgress = () => {
    return {
        type: DELETE_ALL_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS,
    };
};

export const deleteAllWooCommerceProductDataFieldsSuccess = () => {
    return {
        type: DELETE_ALL_WOOCOMMERCE_PRODUCT_DATA_SUCCESS
    };
};

export const deleteAllWooCommerceProductDataFieldsFailure = (error) => {
    return {
        type: DELETE_ALL_WOOCOMMERCE_PRODUCT_DATA_FAILURE,
        payload: {
            error: error
        },
    };
};

export const deleteWooCommerceProductDataField = (fieldId) => {
    return {
        type: DELETE_WOOCOMMERCE_PRODUCT_DATA_FIELD,
        payload: {
            fieldId: fieldId,
        },
    };
};

export const deleteWooCommerceProductDataOption = (fieldId, id) => {
    return {
        type: DELETE_WOOCOMMERCE_PRODUCT_DATA_OPTION,
        payload: {
            id: id,
            fieldId: fieldId,
        },
    };
};

export const hydrateWooCommerceProductDataValues = (values) => {
    return {
        type: HYDRATE_WOOCOMMERCE_PRODUCT_DATA_VALUES,
        payload: {
            values: values
        },
    };
};

export const setWooCommerceProductDataFields = (fields) => {
    return {
        type: SET_WOOCOMMERCE_PRODUCT_DATA_FIELDS,
        payload: {
            fields: fields
        },
    };
};

export const setWooCommerceProductDataOptions = (fieldId, options) => {
    return {
        type: SET_WOOCOMMERCE_PRODUCT_DATA_OPTIONS,
        payload: {
            fieldId: fieldId,
            options: options
        },
    };
};

export const setWooCommerceProductDataStatusSaved = () => {
    return {
        type: SET_WOOCOMMERCE_PRODUCT_DATA_STATUS_SAVED
    };
};

export const setWooCommerceProductDataStatusValid = () => {
    return {
        type: SET_WOOCOMMERCE_PRODUCT_DATA_STATUS_VALID
    };
};

export const setWooCommerceProductDataStatusInvalid = () => {
    return {
        type: SET_WOOCOMMERCE_PRODUCT_DATA_STATUS_INVALID
    };
};

export const submitWooCommerceProductDataFieldsInProgress = () => {
    return {
        type: SUBMIT_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS,
    };
};

export const submitWooCommerceProductDataFieldsSuccess = () => {
    return {
        type: SUBMIT_WOOCOMMERCE_PRODUCT_DATA_SUCCESS
    };
};

export const submitWooCommerceProductDataFieldsFailure = (error) => {
    return {
        type: SUBMIT_WOOCOMMERCE_PRODUCT_DATA_FAILURE,
        payload: {
            error: error
        },
    };
};

export const toggleWooCommerceProductDataFieldIsRequired = (id, postDataId, isRequired) => {
    return {
        type: TOGGLE_WOOCOMMERCE_PRODUCT_DATA_FIELD_IS_REQUIRED,
        payload: {
            id: id,
            postDataId: postDataId,
            isRequired: isRequired
        },
    };
};

export const updateWooCommerceProductDataFieldName = (id, postDataId, name) => {
    return {
        type: UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_NAME,
        payload: {
            id: id,
            postDataId: postDataId,
            name: name
        },
    };
};

export const updateWooCommerceProductDataFieldDefaultValue = (id, postDataId, value) => {
    return {
        type: UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_DEFAULT_VALUE,
        payload: {
            id: id,
            postDataId: postDataId,
            value: value
        },
    };
};

export const updateWooCommerceProductDataFieldDescription = (id, postDataId, description) => {
    return {
        type: UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_DESCRIPTION,
        payload: {
            id: id,
            postDataId: postDataId,
            description: description
        },
    };
};

export const updateWooCommerceProductDataFieldType = (id, postDataId, type) => {
    return {
        type: UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_TYPE,
        payload: {
            id: id,
            postDataId: postDataId,
            type: type
        },
    };
};

export const updateWooCommerceProductDataOptionLabel = (id, postDataId, fieldId, label) => {
    return {
        type: UPDATE_WOOCOMMERCE_PRODUCT_DATA_OPTION_LABEL,
        payload: {
            id: id,
            postDataId: postDataId,
            fieldId: fieldId,
            label: label,
        },
    };
};

export const updateWooCommerceProductDataOptionValue = (id, postDataId, fieldId, value) => {
    return {
        type: UPDATE_WOOCOMMERCE_PRODUCT_DATA_OPTION_VALUE,
        payload: {
            id: id,
            postDataId: postDataId,
            fieldId: fieldId,
            value: value,
        },
    };
};