import React from 'react';
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import {grayColor} from "../../utils/colors";

const Breadcrumb = ({label, link, isFirst, isLast}) => {

    return (
        <li
            className={`i-flex-center s-8 ${isLast ? 'current' : ''}`}
            aria-current={isLast ? 'page' : undefined}
        >
            <span className="separator top-2" aria-hidden="true">
                <Icon
                    icon="bx:bx-chevron-right"
                    color={grayColor()}
                    width="18px"
                />
            </span>
            {link ?
                <Link to={link}>
                    {label}
                </Link>
                :
                label
            }
        </li>
    );
};

Breadcrumb.propTypes = {
    label: PropTypes.string.isRequired,
    link: PropTypes.string,
    isFirst: PropTypes.bool,
    isLast: PropTypes.bool,
};

export default Breadcrumb;