import React from 'react';
import PropTypes from 'prop-types';
import '../../scss/woocommerce.scss';
import {woocommerceIconsMap} from "../../constants/woocommerce_icons_map.jsx";

const WooCommerceListElement = ({icon, label}) => {

    if(!icon){
        return null;
    }

    // validate icon
    if (!Object.values(woocommerceIconsMap).includes(icon)){
        return null;
    }

    if(!label){
        return null;
    }

    return (
        <div className="acpt-wc-icon i-flex-center s-4">
            <span className={`wcicon-${icon}`} />
            <span className="acpt-wc-icon-label">{label}</span>
        </div>
    );
};

WooCommerceListElement.propTypes = {
    icon: PropTypes.oneOf(Object.values(woocommerceIconsMap)).isRequired,
    label: PropTypes.string.isRequired
};

export default WooCommerceListElement;