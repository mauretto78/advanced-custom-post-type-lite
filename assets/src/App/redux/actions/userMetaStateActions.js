export const CREATE_USER_META_BOX = 'CREATE_USER_META_BOX';
export const CREATE_USER_META_FIELD = 'CREATE_USER_META_FIELD';
export const CREATE_USER_META_OPTION = 'CREATE_USER_META_OPTION';
export const DELETE_ALL_USER_META_FAILURE = 'DELETE_ALL_USER_META_FAILURE';
export const DELETE_ALL_USER_META_IN_PROGRESS = 'DELETE_ALL_USER_META_IN_PROGRESS';
export const DELETE_ALL_USER_META_SUCCESS = 'DELETE_ALL_USER_META_SUCCESS';
export const DELETE_USER_META_BOX = 'DELETE_USER_META_BOX';
export const DELETE_USER_META_FIELD = 'DELETE_USER_META_FIELD';
export const DELETE_USER_META_OPTION = 'DELETE_USER_META_OPTION';
export const HYDRATE_USER_META_VALUES = 'HYDRATE_USER_META_VALUES';
export const SET_USER_META_BOXES = 'SET_USER_META_BOXES';
export const SET_USER_META_FIELDS = 'SET_USER_META_FIELDS';
export const SET_USER_META_OPTIONS = 'SET_USER_META_OPTIONS';
export const SET_USER_META_STATUS_INVALID = 'SET_USER_META_STATUS_INVALID';
export const SET_USER_META_STATUS_SAVED = 'SET_USER_META_STATUS_SAVED';
export const SET_USER_META_STATUS_VALID = 'SET_USER_META_STATUS_VALID';
export const SUBMIT_USER_META_IN_PROGRESS = 'SUBMIT_USER_META_IN_PROGRESS';
export const SUBMIT_USER_META_SUCCESS = 'SUBMIT_USER_META_SUCCESS';
export const SUBMIT_USER_META_FAILURE = 'SUBMIT_USER_META_FAILURE';
export const TOGGLE_USER_META_FIELD_SHOW_IN_ARCHIVE = 'TOGGLE_USER_META_FIELD_SHOW_IN_ARCHIVE';
export const TOGGLE_USER_META_FIELD_IS_REQUIRED = 'TOGGLE_USER_META_FIELD_IS_REQUIRED';
export const UPDATE_USER_META_BOX_TITLE = 'UPDATE_USER_META_BOX_TITLE';
export const UPDATE_USER_META_FIELD_NAME = 'UPDATE_USER_META_FIELD_NAME';
export const UPDATE_USER_META_FIELD_DEFAULT_VALUE = 'UPDATE_USER_META_FIELD_DEFAULT_VALUE';
export const UPDATE_USER_META_FIELD_DESCRIPTION = 'UPDATE_USER_META_FIELD_DESCRIPTION';
export const UPDATE_USER_META_FIELD_TYPE = 'UPDATE_USER_META_FIELD_TYPE';
export const UPDATE_USER_META_OPTION_LABEL = 'UPDATE_USER_META_OPTION_LABEL';
export const UPDATE_USER_META_OPTION_VALUE = 'UPDATE_USER_META_OPTION_VALUE';

export const createUserMetaBox = () => {
    return {
        type: CREATE_USER_META_BOX,
        payload: {},
    };
};

export const createUserMetaField = (boxId) => {
    return {
        type: CREATE_USER_META_FIELD,
        payload: {
            boxId: boxId
        },
    };
};

export const createUserMetaOption = (boxId, fieldId) => {
    return {
        type: CREATE_USER_META_OPTION,
        payload: {
            boxId: boxId,
            fieldId: fieldId
        },
    };
};

export const deleteAllUserMetaInProgress = () => {
    return {
        type: DELETE_ALL_USER_META_IN_PROGRESS,
    };
};

export const deleteAllUserMetaSuccess = () => {
    return {
        type: DELETE_ALL_USER_META_SUCCESS
    };
};

export const deleteAllUserMetaFailure = (error) => {
    return {
        type: DELETE_ALL_USER_META_FAILURE,
        payload: {
            error: error
        },
    };
};

export const deleteUserMetaBox = (id) => {
    return {
        type: DELETE_USER_META_BOX,
        payload: {
            id: id
        },
    };
};

export const deleteUserMetaField = (boxId, fieldId) => {
    return {
        type: DELETE_USER_META_FIELD,
        payload: {
            boxId: boxId,
            fieldId: fieldId,
        },
    };
};

export const deleteUserMetaOption = (boxId, fieldId, id) => {
    return {
        type: DELETE_USER_META_OPTION,
        payload: {
            id: id,
            boxId: boxId,
            fieldId: fieldId,
        },
    };
};

export const hydrateUserMetaValues = (values) => {
    return {
        type: HYDRATE_USER_META_VALUES,
        payload: {
            values: values
        },
    };
};

export const setUserMetaBoxes = (boxes) => {
    return {
        type: SET_USER_META_BOXES,
        payload: {
            boxes: boxes
        },
    };
};

export const setUserMetaFields = ( boxId, fields) => {
    return {
        type: SET_USER_META_FIELDS,
        payload: {
            boxId: boxId,
            fields: fields
        },
    };
};

export const setUserMetaOptions = (boxId, fieldId, options) => {
    return {
        type: SET_USER_META_OPTIONS,
        payload: {
            boxId: boxId,
            fieldId: fieldId,
            options: options
        },
    };
};

export const setUserMetaStatusSaved = () => {
    return {
        type: SET_USER_META_STATUS_SAVED
    };
};

export const setUserMetaStatusValid = () => {
    return {
        type: SET_USER_META_STATUS_VALID
    };
};

export const setUserMetaStatusInvalid = () => {
    return {
        type: SET_USER_META_STATUS_INVALID
    };
};

export const submitUserMetaInProgress = () => {
    return {
        type: SUBMIT_USER_META_IN_PROGRESS,
    };
};

export const submitUserMetaSuccess = () => {
    return {
        type: SUBMIT_USER_META_SUCCESS
    };
};

export const submitUserMetaFailure = (error) => {
    return {
        type: SUBMIT_USER_META_FAILURE,
        payload: {
            error: error
        },
    };
};

export const toggleUserMetaFieldShowInArchive = (id, boxId, show) => {
    return {
        type: TOGGLE_USER_META_FIELD_SHOW_IN_ARCHIVE,
        payload: {
            id: id,
            boxId: boxId,
            show: show
        },
    };
};

export const toggleUserMetaFieldIsRequired = (id, boxId, isRequired) => {
    return {
        type: TOGGLE_USER_META_FIELD_IS_REQUIRED,
        payload: {
            id: id,
            boxId: boxId,
            isRequired: isRequired
        },
    };
};

export const updateUserMetaBoxTitle = (id, name) => {
    return {
        type: UPDATE_USER_META_BOX_TITLE,
        payload: {
            id: id,
            name: name
        },
    };
};

export const updateUserMetaFieldName = (id, boxId, name) => {
    return {
        type: UPDATE_USER_META_FIELD_NAME,
        payload: {
            id: id,
            boxId: boxId,
            name: name
        },
    };
};

export const updateUserMetaFieldDefaultValue = (id, boxId, value) => {
    return {
        type: UPDATE_USER_META_FIELD_DEFAULT_VALUE,
        payload: {
            id: id,
            boxId: boxId,
            value: value
        },
    };
};

export const updateUserMetaFieldDescription = (id, boxId, description) => {
    return {
        type: UPDATE_USER_META_FIELD_DESCRIPTION,
        payload: {
            id: id,
            boxId: boxId,
            description: description
        },
    };
};

export const updateUserMetaFieldType = (id, boxId, type) => {
    return {
        type: UPDATE_USER_META_FIELD_TYPE,
        payload: {
            id: id,
            boxId: boxId,
            type: type
        },
    };
};

export const updateUserMetaOptionLabel = (id, boxId, fieldId, label) => {
    return {
        type: UPDATE_USER_META_OPTION_LABEL,
        payload: {
            id: id,
            boxId: boxId,
            fieldId: fieldId,
            label: label,
        },
    };
};

export const updateUserMetaOptionValue = (id, boxId, fieldId, value) => {
    return {
        type: UPDATE_USER_META_OPTION_VALUE,
        payload: {
            id: id,
            boxId: boxId,
            fieldId: fieldId,
            value: value,
        },
    };
};