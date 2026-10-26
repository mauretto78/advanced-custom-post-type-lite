export const reactSelectStyles = {
    control: (base, state) => ({
        ...base,
        background: state.isDisabled ? 'var(--acpt-pale-gray)' : "var(--acpt-white)",
        borderRadius: "4px",
        borderWidth: "1px",
        borderColor: state.isFocused ? "var(--acpt-darken-primary)" : "var(--acpt-light-gray)",
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        boxShadow: null,
        "&:hover": {
            borderColor: "var(--acpt-darken-primary)"
        },
        minHeight: "46px",
    }),
    dropdownIndicator: base => ({
        ...base,
        color: "var(--acpt-light-gray)"
    }),
    option: (styles, state) => ({
        ...styles,
        backgroundColor: state.isSelected ? 'var(--acpt-primary-color)' : 'var(--acpt-white)',
        color: state.isSelected ? 'var(--acpt-primary-color-white)' : 'var(--acpt-black)',
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        "&:hover": {
            backgroundColor: "var(--acpt-light-gray)"
        }
    }),
    valueContainer: (styles, state) => ({
        ...styles,
        borderColor: state.isFocused ? "var(--acpt-darken-primary)" : "var(--acpt-light-gray)",
    })
};

export const styleVariants = {
    // Base
    WHITE:              'white',
    BORDERED:           'bordered',
    DEFAULT:            'default',
    DISABLED:           'disabled',

    // Filled
    PRIMARY:            'primary',
    SECONDARY:          'secondary',
    DANGER:             'danger',
    SUCCESS:            'success',
    INFO:               'info',
    WARNING:            'warning',
    ACCENT:             'accent',

    // Outlined
    OUTLINED:           'outlined',
    OUTLINED_PRIMARY:   'outlined-primary',
    OUTLINED_SECONDARY: 'outlined-secondary',
    OUTLINED_DANGER:    'outlined-danger',
    OUTLINED_SUCCESS:   'outlined-success',
    OUTLINED_INFO:      'outlined-info',
    OUTLINED_WARNING:   'outlined-warning',
};
