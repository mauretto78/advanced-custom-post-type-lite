import React from "react";
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';

const Pagination = ({currentPage, totalPages, baseLink}) => {

    const rows = [];
    for (let i = 1; i <= totalPages; i++) {
        rows.push(i);
    }

    if(rows.length < 2){
        return null;
    }

    return (
        <ul className="acpt-pagination">
            {rows.map((row, index) => (
                <li key={index}>
                    {row === currentPage
                        ?
                        <span>
                            {row}
                        </span>
                        :
                        <Link to={`${baseLink}/${row}`}>
                            {row}
                        </Link>
                    }
                </li>
            ))}
        </ul>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    baseLink: PropTypes.string.isRequired,
};

export default Pagination;

