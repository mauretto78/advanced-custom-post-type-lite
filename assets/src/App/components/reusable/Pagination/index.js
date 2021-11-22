import React from "react";
import {Link} from "react-router-dom";

const Pagination = ({currentPage, perPage, records}) => {

    const totalPages = Math.ceil( records / perPage );
    const rows = [];
    for (let i = 1; i <= totalPages; i++) {
        rows.push(i);
    }

    if(rows.length < 2){
        return <React.Fragment/>;
    }

    return (
        <ul className="acpt-pagination">
            {rows.map((row) => (
                <li>
                    {row == currentPage
                        ?
                        <span>
                            {row}
                        </span>
                        :
                        <Link to={`/${row}`}>
                            {row}
                        </Link>
                    }
                </li>
            ))}
        </ul>
    );
};

export default Pagination;