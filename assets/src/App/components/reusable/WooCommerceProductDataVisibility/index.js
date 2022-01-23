import React from 'react';

const WooCommerceProductDataVisibility = ({visibility}) => {

    let vis = [];

    if(visibility.includes('show_if_simple')){ vis.push("Show in simple products"); }
    if(visibility.includes('show_if_variable')){ vis.push("Show in variable products"); }
    if(visibility.includes('show_if_grouped')){ vis.push("Show in grouped products"); }
    if(visibility.includes('show_if_external')){ vis.push("Show in external products"); }
    if(visibility.includes('hide_if_virtual')){ vis.push("Hide in virtual products"); }
    if(visibility.includes('hide_if_external')){ vis.push("Hide in external products"); }

    return (
        <React.Fragment>
            {vis.map((vis)=>(
                <span className="acpt-badge mr-1">
                    <span className="label">
                        {vis}
                    </span>
                </span>
            ))}
        </React.Fragment>
    );
};

export default WooCommerceProductDataVisibility;