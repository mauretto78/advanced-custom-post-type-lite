export const reactSelectStyles = {
    control: (base, state) => ({
        ...base,
        background: "#fff",
        borderRadius: "10px",
        borderWidth: "2px",
        borderColor: state.isFocused ? "#012169" : "#ddd",
        boxShadow: null,
        "&:hover": {
            borderColor: "#012169"
        }
    }),
    dropdownIndicator: base => ({
        ...base,
        color: "#ddd"
    }),
    option: (styles, state) => ({
        ...styles,
        backgroundColor: state.isSelected ? '#012169' : '#fff',
        color: state.isSelected ? '#fff' : '#444',
        "&:hover": {
            backgroundColor: "#ddd"
        }
    }),
    valueContainer: (styles, state) => ({
        ...styles,
        borderColor: state.isFocused ? "#012169" : "#ddd",
    })
};