import React from 'react';
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';
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
                <span className="separator top-2">
                    <Icon icon="bx:bx-chevron-right" color="#777" width="18px" />
                </span>
            )}
        </React.Fragment>
    );
};

Breadcrumb.propTypes = {
    label: PropTypes.string.isRequired,
    link: PropTypes.string,
    isLast: PropTypes.bool,
};

export default Breadcrumb;