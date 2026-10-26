import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumb from "./Breadcrumb";
import {isRTLOrientation} from "../../utils/misc";
import {Link} from "react-router-dom";
import {Icon} from "@iconify/react";

const Breadcrumbs = ({crumbs}) => {

    if(crumbs.length === 0){
        return null;
    }

    return (
        <div id="acpt-breadcrumbs" className={`acpt-breadcrumbs ${isRTLOrientation()}`}>
            {crumbs.length > 0 && (
                    <nav aria-label="Breadcrumb" className="breadcrumb">
                        {/* role="list" is intentional, not redundant: `i-flex-center` sets
                            display:flex, which makes Safari/VoiceOver drop the <ol>'s
                            implicit list semantics — re-asserting the role restores them. */}
                        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
                        <ol className="m-0 i-flex-center s-8" role="list">
                            <li>
                                <Link
                                    to="/"
                                    aria-label="Home"
                                >
                                    <Icon icon="bx:home" width={18} />
                                </Link>
                            </li>
                            {crumbs.map((crumb, index) => (
                                <Breadcrumb
                                    label={crumb.label}
                                    link={crumb.link}
                                    isFirst={index === 0}
                                    isLast={(index + 1) === crumbs.length}
                                    key={index}
                                />
                            ))}
                        </ol>
                    </nav>
                    )}
                </div>
                );
            };

Breadcrumbs.propTypes = {
    crumbs: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        link: PropTypes.string,
        isFirst: PropTypes.bool,
        isLast: PropTypes.bool,
  })).isRequired
};

export default Breadcrumbs;