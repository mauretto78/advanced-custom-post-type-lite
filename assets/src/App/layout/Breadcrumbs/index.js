import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumb from "./Breadcrumb";

const Breadcrumbs = ({crumbs}) => {

    const settings = document.globals;

    return (
        <div className={`acpt-breadcrumbs ${settings.globals.is_rtl === true ? `rtl` : ``}`}>
            {crumbs.length > 0 && (
                <ul className="i-flex-center s-8">
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

Breadcrumbs.propTypes = {
  crumbs: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string,
      isLast: PropTypes.bool,
  })).isRequired
};

export default Breadcrumbs;