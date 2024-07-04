export const reactSelectStyles = {
    control: (base, state) => ({
        ...base,
        background: state.isDisabled ? '#f8f8f8' : "#fff",
        borderRadius: "4px",
        borderWidth: "1px",
        borderColor: state.isFocused ? "#135e96" : "#ddd",
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        boxShadow: null,
        "&:hover": {
            borderColor: "#135e96"
        },
        minHeight: "46px",
    }),
    dropdownIndicator: base => ({
        ...base,
        color: "#ddd"
    }),
    option: (styles, state) => ({
        ...styles,
        backgroundColor: state.isSelected ? '#135e96' : '#fff',
        color: state.isSelected ? '#fff' : '#444',
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        "&:hover": {
            backgroundColor: "#ddd"
        }
    }),
    valueContainer: (styles, state) => ({
        ...styles,
        borderColor: state.isFocused ? "#135e96" : "#ddd",
    })
};

export const styleVariants = {
    WHITE: 'white',
    BORDERED: 'bordered',
    DEFAULT: 'default',
    DISABLED: 'disabled',
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    DANGER: 'danger',
    SUCCESS: 'success',
    INFO: 'info',
    WARNING: 'warning',
};