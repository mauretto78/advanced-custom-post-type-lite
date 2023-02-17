import React from 'react';
import Breadcrumb from "./Breadcrumb";

const Breadcrumbs = ({crumbs}) => {
    return (
        <div className="acpt-breadcrumbs">
            {crumbs.length > 0 && (
                <ul>
                    {crumbs.map((crumb, index) => (
                        <Breadcrumb
                            label={crumb.label}
                            link={crumb.link}
                            isLast={(index+1) === crumbs.length}
                            key={index}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Breadcrumbs;