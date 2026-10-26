import React from 'react';
import PropTypes from "prop-types";
import {useTableQueryState} from "../../hooks/useTableQueryState.jsx";
import {primaryColor} from "../../utils/colors.jsx";
import {Icon} from "@iconify/react";

const TableSearchInput = ({placeholder="Search..."}) => {

    const {
        searchValue,
        setSearchValue
    } = useTableQueryState();

    return (
        <div data-testid="table-search-input" className="search-input">
            <span className="search-icon">
                <Icon icon="bx:bx-search" color={primaryColor()} width={16} />
              </span>
            <input
                className="form-control sm search"
                type="search"
                defaultValue={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );
};

TableSearchInput.propTypes = {
    placeholder: PropTypes.string,
};

export default TableSearchInput;