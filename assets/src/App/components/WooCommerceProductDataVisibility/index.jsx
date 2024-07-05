import React from 'react';
import PropTypes from 'prop-types';
import useTranslation from "../../hooks/useTranslation";

const WooCommerceProductDataVisibility = ({visibility}) => {

    let vis = [];

    if(visibility.includes('show_if_simple')){ vis.push("Show in simple products"); }
    if(visibility.includes('show_if_variable')){ vis.push("Show in variable products"); }
    if(visibility.includes('show_if_grouped')){ vis.push("Show in grouped products"); }
    if(visibility.includes('show_if_external')){ vis.push("Show in external products"); }
    if(visibility.includes('hide_if_virtual')){ vis.push("Hide in virtual products"); }
    if(visibility.includes('hide_if_external')){ vis.push("Hide in external products"); }

    return (
        <div className="max-w-400 flex-wrap i-flex-center s-8">
            {vis.map((vis)=>(
                <span className="acpt-badge">
                    <span className="label">
                        {useTranslation(vis)}
                    </span>
                </span>
            ))}
        </div>
    );
};

WooCommerceProductDataVisibility.propTypes = {
    visibility: PropTypes.array.isRequired
};

export default WooCommerceProductDataVisibility;