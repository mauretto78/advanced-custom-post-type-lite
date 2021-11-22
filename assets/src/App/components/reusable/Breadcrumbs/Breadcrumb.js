import React from 'react';
import {Link} from "react-router-dom";
import {Icon} from "@iconify/react";

const Breadcrumb = ({label, link, isLast}) => {

    return (
        <React.Fragment>
            <li className={isLast ? 'current' : ''}>
                {link ?
                    <Link to={link}>
                        {label}
                    </Link>
                    :
                    label
                }
            </li>
            {!isLast && (
                <span className="separator">
                    <Icon icon="bx:bx-chevron-right" color="#aaa" width="20px" />
                </span>
            )}
        </React.Fragment>
    );
};

export default Breadcrumb;