import PropTypes from "prop-types";

export const productFieldOptionProps = {
    id: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    isDefault: PropTypes.bool,
};

export const productFieldProps = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    type: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape(productFieldOptionProps)),
};

export const productRecordProps = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({icon: PropTypes.string})]),
    showInUI: PropTypes.bool,
    visibility: PropTypes.arrayOf(PropTypes.string),
    fields: PropTypes.arrayOf(PropTypes.shape(productFieldProps)),
};
