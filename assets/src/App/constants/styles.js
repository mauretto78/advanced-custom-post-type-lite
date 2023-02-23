export const reactSelectStyles = {
    control: (base, state) => ({
        ...base,
        background: "#fff",
        borderRadius: "2px",
        borderWidth: "1px",
        borderColor: state.isFocused ? "#135e96" : "#ddd",
        boxShadow: null,
        "&:hover": {
            borderColor: "#135e96"
        }
    }),
    dropdownIndicator: base => ({
        ...base,
        color: "#ddd"
    }),
    option: (styles, state) => ({
        ...styles,
        backgroundColor: state.isSelected ? '#135e96' : '#fff',
        color: state.isSelected ? '#fff' : '#444',
        "&:hover": {
            backgroundColor: "#ddd"
        }
    }),
    valueContainer: (styles, state) => ({
        ...styles,
        borderColor: state.isFocused ? "#135e96" : "#ddd",
    })
};