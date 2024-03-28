import React from 'react';
import '../../scss/woocommerce.scss';

const WooCommerceListElement = ( {icon, label}) => {
    return (
        <div className="i-flex-center s-4">
            <span className={`wcicon-${icon}`} />
            <span>{label}</span>
        </div>
    );
};

export default WooCommerceListElement;